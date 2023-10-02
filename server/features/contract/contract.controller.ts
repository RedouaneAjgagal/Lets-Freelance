import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import Contract from "./contract.model";
import { isValidObjectId } from "mongoose";
import cancelContractValidator from "./validators/cancelContractValidator";
import { User } from "../auth";
import { isInvalidStatus, isInvalidSumbitedWokedHours } from "./validators/contractInputValidator";
import sendContractCancelationEmail from "./services/sendContractCancelationEmail";
import { getServicePriceAfterFees } from "../service";
import sendServiceContractCompletedEmail from "./services/sendServiceContractCompletedEmail";
import sendCompletedJobContractEmail from "./services/sendCompletedJobContractEmail";
import getFixedPriceJobAfterFees from "../job/utils/getFixedPriceJobAfterFees";
import getHourlyPriceJobAfterFees from "../job/utils/getHourlyPriceJobAfterFees";
import { jobFees } from "../job";
import sendPaidHoursEmail from "./services/sendPaidHoursEmail";
import jobFeeTiers from "../job/utils/jobFeeTiers";
import stripe from "../../stripe/stripeConntect";
import transferToStripeAmount from "../../stripe/utils/transferToStripeAmount";


//@desc get all contracts related to the current user
//@route GET /api/v1/contracts
//@access authentication
const getContracts: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { status } = req.query;

    const getStatus = status?.toString() as "inProgress" | "completed" | "canceled" | undefined;

    // if status exist check if its valid
    if (getStatus) {
        const invalidStatus = isInvalidStatus(getStatus);
        if (invalidStatus) {
            throw new BadRequestError(invalidStatus);
        }
    }

    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // find contracts & filter if either freelancer or employer have inProgress status

    const contracts = await Contract.find({
        $or: [
            {
                [profile.userAs]: {
                    user: profile.user._id,
                    profile: profile._id,
                    status: getStatus || "inProgress"
                }
            },
            {
                [`${profile.userAs}.user`]: profile.user._id,
                [`${profile.userAs}.profile`]: profile._id,
                [profile.userAs === "employer" ? "freelancer.status" : "employer.status"]: getStatus || "inProgress"
            }
        ]
    }, { cancelRequest: false }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json(contracts);
}


//@desc get contract cancelation requests
//@route GET /api/v1/contracts/cancel-requests
//@access authorization (admin - owner)
const cancelationRequests: RequestHandler = async (req: CustomAuthRequest, res) => {
    const contracts = await Contract.find({ "cancelRequest.status": "pending", $or: [{ "freelancer.status": "inProgress" }, { "employer.status": "inProgress" }] });
    res.status(StatusCodes.OK).json(contracts);
}


//@desc request a contract cancelation
//@route POST /api/v1/contracts/:contractId
//@access authentication
const cancelContractRequest: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { contractId } = req.params;
    const { subject, reason } = req.body;

    // check if valid inputs
    cancelContractValidator({
        subject,
        reason
    });

    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(contractId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // find contract
    const contract = await Contract.findById(contractId);
    if (!contract) {
        throw new BadRequestError(`Found no contract with id ${contractId}`);
    }

    // check if current user have access to this contract (belongs to)
    if (contract[profile.userAs].profile._id.toString() !== profile._id.toString()) {
        throw new UnauthorizedError("You dont have access to these ressources");
    }

    // check if already requested a cancelation
    if (contract.cancelRequest[profile.userAs].isCancelRequest) {
        throw new BadRequestError("You have already requested a contract cancelation");
    }

    // check if the contract is not completed yet
    if (contract.freelancer.status === "completed" && contract.employer.status === "completed") {
        throw new BadRequestError("This contract is already completed");
    }

    const contractCancelationInfo = {
        isCancelRequest: true,
        subject,
        reason
    }

    // update contract to cancelation
    contract.cancelRequest.status = "pending";
    contract.cancelRequest[profile.userAs] = contractCancelationInfo;
    await contract.save();

    res.status(StatusCodes.OK).json({ msg: "You have requested a contract cancelation" });
}


//@desc approve or reject contract cancelaton request
//@route PATCH /api/v1/contracts/cancel-requests
//@access authorization
const cancelContract: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { contractId, status }: { contractId: string; status: "inProgress" | "completed" | "canceled" } = req.body;

    // check if valid status
    const invalidStatus = isInvalidStatus(status);
    if (invalidStatus) {
        throw new BadRequestError(invalidStatus);
    }

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(contractId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid ID");
    }

    // find contract
    const contract = await Contract.findById(contractId).populate({ path: "freelancer.user employer.user", select: "email" });
    if (!contract) {
        throw new BadRequestError(`Found no contract with ID ${contractId}`);
    }

    // check if status is pending
    if (contract.cancelRequest.status !== "pending") {
        throw new BadRequestError("This contract is not in pending status for cancelation");
    }


    let requestResult = "approved";

    // cancel contract
    if (status === "canceled") {
        contract.freelancer.status = "canceled";
        contract.employer.status = "canceled";
        contract.cancelRequest.status = "approved";
        await contract.save();

        // send email cancelation to the freelancer
        sendContractCancelationEmail({
            activityTitle: contract[contract.activityType]!.title,
            contractId: contract._id.toString(),
            email: contract.freelancer.user.email!,
            value: "canceled"
        });

        // send email cancelation to the employer
        sendContractCancelationEmail({
            activityTitle: contract[contract.activityType]!.title,
            contractId: contract._id.toString(),
            email: contract.employer.user.email!,
            value: "canceled"
        });
    }

    // reject contract cancelation request
    if (status === "inProgress") {
        requestResult = "rejected";
        contract.cancelRequest.status = "rejected";
        await contract.save();

        // send email cancelation to the freelancer
        sendContractCancelationEmail({
            activityTitle: contract[contract.activityType]!.title,
            contractId: contract._id.toString(),
            email: contract.freelancer.user.email!,
            value: "rejected"
        });

        // send email cancelation to the employer
        sendContractCancelationEmail({
            activityTitle: contract[contract.activityType]!.title,
            contractId: contract._id.toString(),
            email: contract.employer.user.email!,
            value: "rejected"
        });
    }

    res.status(StatusCodes.OK).json({ msg: `Contract cancelation request has been ${requestResult}` });
}


//@desc complete service contract for freelancer and employer
//@route PATCH /api/v1/contracts/:contractId/service
//@access authentication
const completeServiceContract: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { contractId } = req.params;
    const { isCompleted }: { isCompleted: boolean } = req.body;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(contractId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // check if isCompleted exist
    if (isCompleted === undefined) {
        throw new BadRequestError("is completed contract is required");
    }

    // check if valid format
    if (typeof isCompleted !== "boolean") {
        throw new BadRequestError("Invalid value");
    }

    // find contract
    const contract = await Contract.findOne({ _id: contractId, activityType: "service" }).populate({ path: "freelancer.user employer.user", select: "email" });
    if (!contract) {
        throw new NotFoundError(`Found no contract with id ${contractId}`);
    }

    // find user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "_id userAs" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the current user have access to this contract
    if (contract[user.profile!.userAs!].user._id.toString() !== user._id.toString()) {
        throw new UnauthorizedError("You dont have access to these ressources");
    }

    // check if status is completed
    if (!isCompleted) {
        throw new BadRequestError("You cant set contract to completed when its not");
    }

    // check if the user already completed the contract
    if (contract[user.profile!.userAs!].status === "completed") {
        throw new BadRequestError("You have already completed this service");
    }

    // update contract status
    contract[user.profile!.userAs!].status = "completed";


    if (contract.freelancer.status === "completed" && contract.employer.status === "completed") {

        const servicePrice = contract.service!.tier.price;

        // get calculated prices after fees
        const { freelancerReceiveAmount, feeAmount, feeType } = getServicePriceAfterFees({
            servicePrice
        });

        // the amount freelancer going to receive
        const payment = contract.payments[0];
        if (payment.employer?.status === "paid") {
            console.log({ freelancerReceiveAmount });
            payment.freelancer = {
                status: "pending",
                paidAt: ""
            }
        }

        // send service contract completed email to the employer
        sendServiceContractCompletedEmail({
            contractId: contract._id.toString(),
            email: contract.employer.user.email!,
            price: servicePrice,
            priceAfterFees: freelancerReceiveAmount,
            userAs: "employer",
            feeAmount,
            feeType,
        });

        // send service contract completed email to the freelancer
        sendServiceContractCompletedEmail({
            contractId: contract._id.toString(),
            email: contract.freelancer.user.email!,
            price: servicePrice,
            priceAfterFees: freelancerReceiveAmount,
            userAs: "freelancer",
            feeAmount,
            feeType,
        });
    }

    await contract.save();

    res.status(StatusCodes.OK).json({ msg: `You have marked service contract ID ${contract._id} as completed` });
}


//@desc complete job contract for freelancer and employer
//@route PATCH /api/v1/contracts/:contractId/job
//@access authentication
const completeJobContract: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { contractId } = req.params;
    const { isCompleted }: { isCompleted: boolean } = req.body;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(contractId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // check if isCompleted exist
    if (isCompleted === undefined) {
        throw new BadRequestError("is completed contract is required");
    }

    // check if valid format
    if (typeof isCompleted !== "boolean") {
        throw new BadRequestError("Invalid value");
    }

    // find contract
    const contract = await Contract.findOne({ _id: contractId, activityType: "job" }).populate({ path: "freelancer.user employer.user", select: "email stripe" });
    if (!contract) {
        throw new NotFoundError(`Found no contract with id ${contractId}`);
    }

    // find user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "_id userAs" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the current user have access to this contract
    if (contract[user.profile!.userAs!].user._id.toString() !== user._id.toString()) {
        throw new UnauthorizedError("You dont have access to these ressources");
    }

    // check if status is completed
    if (!isCompleted) {
        throw new BadRequestError("You cant set contract to completed when its not");
    }

    // check if the user already completed the contract
    if (contract[user.profile!.userAs!].status === "completed") {
        throw new BadRequestError("You have already completed this job");
    }

    // update contract status
    contract[user.profile!.userAs!].status = "completed";

    if (contract.freelancer.status === "completed" && contract.employer.status === "completed") {
        if (contract.job!.priceType === "fixed") {

            const freelancerNetAmount = jobFeeTiers.getFixedJobFeeTier({
                amount: contract.job!.price
            });

            // the amount freelancer going to receive
            console.log({ freelancerReceivedAmount: freelancerNetAmount });

            const freelancerStripeAmount = transferToStripeAmount(freelancerNetAmount);

            const session = await stripe.checkout.sessions.retrieve(contract.payments[0].sessionId!);

            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent!.toString());

            // transfer the amount to the freelancer after completing the job
            await stripe.transfers.create({
                currency: "usd",
                amount: freelancerStripeAmount,
                destination: contract.freelancer.user.stripe!.id!,
                description: "Completed fixed price job",
                source_transaction: paymentIntent.latest_charge?.toString(),
                metadata: {
                    contractId: contract._id.toString()
                }
            });

            // ------------ try this out later when payout arrive because transfer method doesnt work for US/CA bank accounts because of the platform region is not locatated in the US/CA and must contact stripe support for this ------------ //
            // const externalAccounts = await stripe.accounts.listExternalAccounts(contract.freelancer.user.stripe!.id!, {
            //     object: "bank_account",
            //     limit: 1
            // });
            // const payout = await stripe.payouts.create({
            //     currency: "usd",
            //     amount: freelancerStripeAmount,
            //     destination: externalAccounts.data[0].id,
            //     description: "Completed fixed price job",
            //     source_type: "bank_account",
            //     metadata: {
            //         contractId: contract._id.toString()
            //     }
            // }, {
            //     stripeAccount: contract.freelancer.user.stripe!.id!
            // });

            // send fixed price contract completed email to the employer
            sendCompletedJobContractEmail.fixedPrice({
                contractId: contract._id.toString(),
                userAs: "employer",
                email: contract.employer.user.email!,
                price: contract.job!.price,
                priceAfterFees: freelancerNetAmount
            });

            // send fixed price contract completed email to the freelancer
            sendCompletedJobContractEmail.fixedPrice({
                contractId: contract._id.toString(),
                userAs: "freelancer",
                email: contract.freelancer.user.email!,
                price: contract.job!.price,
                priceAfterFees: freelancerNetAmount
            });

            const payment = contract.payments[0];
            payment.freelancer = {
                status: "paid",
                paidAt: new Date(Date.now()).toString()
            }

        } else {
            const totalWorkedHours = contract.payments.reduce((accumulator, { workedHours }) => {
                return accumulator + (workedHours || 0);
            }, 0);


            const totalAmount = contract.payments.reduce((accumulator, { amount }) => {
                return accumulator + (amount || 0);
            }, 0);

            // send hourly price contract completed email to the freelancer
            sendCompletedJobContractEmail.hourlyPrice({
                contractId: contract._id.toString(),
                email: contract.freelancer.user.email!,
                hourlyPrice: contract.job!.price,
                totalWorkedHours,
                totalAmount
            });

            // send hourly price contract completed email to the employer
            sendCompletedJobContractEmail.hourlyPrice({
                contractId: contract._id.toString(),
                email: contract.employer.user.email!,
                hourlyPrice: contract.job!.price,
                totalWorkedHours,
                totalAmount
            });
        }
    }

    // update the contract
    await contract.save();

    res.status(StatusCodes.OK).json({ msg: `You have marked job contract ID ${contract._id} as completed` });
}


//@desc freelancer can submit worked hours
//@route POST /api/v1/:contractId/submit-hours
//@access authenticaiton
const submitWorkedHours: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { workedHours } = req.body;
    const { contractId } = req.params;

    // check if valid worked hours value
    const invalidSubmitedWorkedHours = isInvalidSumbitedWokedHours(workedHours);
    if (invalidSubmitedWorkedHours) {
        throw new BadRequestError(invalidSubmitedWorkedHours);
    }

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(contractId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // find contract (hourly contracts are only for jobs so search for job contract)
    const contract = await Contract.findOne({ _id: contractId, activityType: "job" });
    if (!contract) {
        throw new BadRequestError(`Found no contract with ID ${contractId}`);
    }

    // find current user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("Only freelancers can submit worked hours");
    }

    // check if freelancer belong to the current contract
    if (contract.freelancer.user._id.toString() !== profile.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to this contract");
    }

    // check if the job contract is an hourly contract
    if (contract.job!.priceType !== "hourly") {
        throw new BadRequestError("Must be an hourly job");
    }

    // check if the contract is still in progress
    if (contract.freelancer.status !== "inProgress" || contract.employer.status !== "inProgress") {
        throw new BadRequestError("You can only submit worked hours to contracts that are still in progress");
    }

    // check if there is already a payment that is not paid yet
    const isAllPaymentsPaid = contract.payments.every(({ employer }) => employer?.status === "paid");
    if (!isAllPaymentsPaid) {
        throw new BadRequestError("You cant submit a new payment until all payments are paid");
    }

    // set worked hours for a new pending payment
    const amount = workedHours * contract.job!.price;
    contract.payments.push({
        workedHours,
        amount
    });

    await contract.save();

    res.status(StatusCodes.OK).json({ msg: "You have submitted your worked hours", workedHours });
}


//@desc employer can pay worked hours using stripe
//@route PATCH /api/v1/:contractId/worked-hours
//@access authenticaiton (employers only)
const payWorkedHours: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { contractId } = req.params;
    const { paymentId } = req.body;

    // check if valid mongodb id
    const isValidContractMongodbId = isValidObjectId(contractId);
    const isValidPaymentMongodbId = typeof paymentId === "string" && isValidObjectId(paymentId);
    if (!isValidContractMongodbId || !isValidPaymentMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user is an employer
    if (profile.userAs !== "employer") {
        throw new BadRequestError("Only employers can pay worked hours");
    }

    // find job contract because its the only contract that pays by hours
    const contract = await Contract.findOne({ _id: contractId, activityType: "job" }).populate({ path: "freelancer.user employer.user", select: "email stripe" });
    if (!contract) {
        throw new BadRequestError(`Found no contract with ID ${contractId}`);
    }

    // check if the current employer have access to this contract
    if (contract.employer.profile._id.toJSON() !== profile._id.toString()) {
        throw new UnauthorizedError("You dont have access to this contract");
    }

    // find the payment index
    const paymentIndex = contract.payments.findIndex(({ _id }) => _id?.toString() === paymentId);
    if (paymentIndex === -1) {
        throw new BadRequestError(`Found no payment with ID ${paymentId}`);
    }

    // find the payment
    const payment = contract.payments[paymentIndex];

    // check if the payment is not paid yet
    if (payment.employer?.status === "paid") {
        throw new BadRequestError("This payment has already been paid");
    }

    // employer amount to be paid
    const employerfeesAmount = jobFees.hourlyJobFees.type === "percent" ? (payment.amount! / 100) * jobFees.hourlyJobFees.amount : jobFees.hourlyJobFees.amount;
    const employerPaymentWithFees = payment.amount! + employerfeesAmount;

    // find payments total
    const totalPayment = contract.payments.reduce((accumulator, { amount, employer }) => {
        if (employer?.status === "paid") {
            return accumulator + (amount || 0);
        }
        return accumulator;
    }, 0);

    const netAmount = jobFeeTiers.getHourlyJobFeeTier({
        paymentAmount: payment.amount!,
        totalPaidAmount: totalPayment
    });

    console.log({ freelancerReveiceAmount: netAmount, employerPaymentWithFees });

    const employerAmount = transferToStripeAmount(employerPaymentWithFees);
    const freelancerReceiveAmount = transferToStripeAmount(netAmount);

    // create new product on stripe
    const product = await stripe.products.create({
        name: `Hourly Job, worked hours: ${payment.workedHours}`,
        default_price_data: {
            currency: "usd",
            unit_amount: employerAmount,
        },
        metadata: {
            contractId,
            paymentId
        }
    });

    // strip validation (fake for now)
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
            {
                price: product.default_price!.toString(),
                quantity: 1
            }
        ],
        payment_intent_data: {
            application_fee_amount: employerAmount - freelancerReceiveAmount,
            transfer_data: {
                destination: contract.freelancer.user.stripe!.id!
            },
            on_behalf_of: contract.freelancer.user.stripe!.id!,
            metadata: {
                contractId,
                paymentId
            }
        },
        customer_email: contract.employer.user.email,
        client_reference_id: contract.employer.user._id.toString(),
        success_url: `http://localhost:5000/api/v1/contracts/${contract._id.toString()}/worked-hours?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:5173",
        metadata: {
            contractId,
            paymentId,
            freelancerReceiveAmount,
            employerAmount,
            employerEmail: contract.employer.user.email!,
            freelancerEmail: contract.freelancer.user.email!
        }
    });

    // set session ID so after payment we check if successed to set as paid
    payment.sessionId = session.id;
    await contract.save();

    console.log({ url: session.url });
    res.redirect(session.url!);
}


//@desc after payment is successed set payment status to paid
//@route GET /api/v1/:contractId/worked-hours
//@access authenticaiton (employers only)
const setAsPaidHours: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { contractId } = req.params;
    const { session_id } = req.query;

    // find user (employer)
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(contractId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // find contract
    const contract = await Contract.findById(contractId);
    if (!contract) {
        throw new BadRequestError(`Found no contract with ID ${contractId}`);
    }

    // check if have access to this contract
    if (contract.employer.profile._id.toString() !== profile._id.toString()) {
        throw new UnauthorizedError("You dont have access to this contract");
    }

    // find the payment
    const payment = contract.payments.find(payment => payment.sessionId === session_id?.toString());
    if (!payment) {
        throw new BadRequestError(`Found no payment with session ID ${session_id?.toString()}`);
    }

    // check if already been paid
    if (payment.employer?.status === "paid") {
        throw new BadRequestError("This payment has already been paid");
    }

    // check if the payment was successful
    const session = await stripe.checkout.sessions.retrieve(payment.sessionId!);
    if (session.payment_status !== "paid") {
        throw new BadRequestError("You must pay the worked hours first");
    }

    // set payments to paid
    payment.employer = {
        status: "paid",
        paidAt: new Date(Date.now()).toString()
    }

    payment.freelancer = {
        status: "pending",
        paidAt: ""
    }

    // send paid hours email to the freelancer
    sendPaidHoursEmail({
        userAs: "freelancer",
        email: session.metadata!.freelancerEmail,
        amount: payment.amount!,
        amountIncludingFees: Number(session.metadata!.freelancerReceiveAmount) / 100,
        feesAmount: undefined,
        feesType: undefined,
        workedHours: payment.workedHours!,
        paymentId: payment._id!.toString()
    });

    // send paid hours email to the freelancer
    sendPaidHoursEmail({
        userAs: "employer",
        email: session.metadata!.employerEmail,
        amount: payment.amount!,
        amountIncludingFees: Number(session.metadata!.employerAmount) / 100,
        feesAmount: jobFees.hourlyJobFees.amount,
        feesType: jobFees.hourlyJobFees.type,
        workedHours: payment.workedHours!,
        paymentId: payment._id!.toString()
    });

    // update the contract
    await contract.save();

    res.status(StatusCodes.OK).json({ msg: `${payment.workedHours} worked hours has been paid successfully` });
}


export {
    getContracts,
    cancelationRequests,
    completeServiceContract,
    completeJobContract,
    cancelContractRequest,
    cancelContract,
    submitWorkedHours,
    payWorkedHours,
    setAsPaidHours
}