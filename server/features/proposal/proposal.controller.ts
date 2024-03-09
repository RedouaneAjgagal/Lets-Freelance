import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose, { PipelineStage, isValidObjectId } from "mongoose";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import createProposalValidator from "./validators/createProposalValidator";
import Proposal from "./proposal.model";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import { jobModel as Job, jobFees } from "../job";
import { isInvalidStatus } from "./validators/proposalInputValidator";
import { contractModel as Contract } from "../contract";
import sendProposalApprovedEmail from "./services/sendProposalApprovedEmail";
import stripe from "../../stripe/stripeConntect";
import transferToStripeAmount from "../../stripe/utils/transferToStripeAmount";
import jobFeeTiers from "../job/utils/jobFeeTiers";
import origin from "../../config/origin";


//@desc get all proposals related to job
//@route get /api/v1/proposals
//@access authentication (job creator only)
const getProposals: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { job_id } = req.query;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(job_id);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // find ptofile
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user an employer
    if (profile.userAs !== "employer") {
        throw new UnauthorizedError("Must be an employer");
    }

    // find job proposals related to the current logged in employer
    const proposals = await Proposal.aggregate([
        {
            $match: {
                job: new mongoose.Types.ObjectId(job_id!.toString())
            }
        },
        {
            $lookup: {
                from: "jobs",
                foreignField: "_id",
                localField: "job",
                as: "job"
            }
        },
        {
            $addFields: {
                job: {
                    $first: "$job"
                }
            }
        },
        {
            $match: {
                $and: [
                    { "job.profile": profile._id },
                    { "job.user": profile.user._id },
                ]
            }
        },
        {
            $lookup: {
                from: "profiles",
                foreignField: "_id",
                localField: "profile",
                as: "profile"
            }
        },
        {
            $addFields: {
                profile: {
                    $first: "$profile"
                }
            }
        },
        {
            $addFields: {
                isBoostedProposal: {
                    $cond: [
                        {
                            $gte: ["$boostProposal.spentConnects", 1]
                        },
                        true,
                        false
                    ]
                }
            }
        },
        {
            $lookup: {
                from: "contracts",
                localField: "_id",
                foreignField: "job.proposal",
                as: "contract"
            }
        },
        {
            $addFields: {
                contract: {
                    $cond: [
                        { $eq: ["$status", "approved"] },
                        { $first: "$contract" },
                        undefined
                    ]
                }
            }
        },
        {
            $project: {
                _id: 1,
                "profile._id": 1,
                "profile.name": 1,
                "profile.avatar": 1,
                "profile.roles.freelancer.jobTitle": 1,
                coverLetter: 1,
                priceType: 1,
                price: 1,
                estimatedTime: 1,
                status: 1,
                isBoostedProposal: 1,
                createdAt: 1,
                "contract._id": 1
            }
        }
    ]);

    res.status(StatusCodes.OK).json(proposals);
}


//@desc create a proposal for a job 
//@route POST /api/v1/proposals
//@access authentication (freelancers only)
const createProposal: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { jobId, coverLetter, estimatedTime, price, spentConnects } = req.body;

    // check if valid inputs
    createProposalValidator({ coverLetter, estimatedTime, price, spentConnects });

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(jobId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // find job
    const job = await Job.findById(jobId);
    if (!job) {
        throw new BadRequestError(`Found no job with id ${jobId}`);
    }

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "stripe" });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the job belong to the current user
    if (job.user._id.toString() === profile.user._id.toString()) {
        throw new BadRequestError("Cannot apply to your own job");
    }

    // check if the user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("Only freelancers can apply");
    }

    // check if the job already open for proposals
    if (job.status !== "open") {
        throw new BadRequestError("You cannot submit proposals to closed jobs");
    }

    // check if already submitted a proposal
    const existedProposal = await Proposal.findOne({ job: jobId, user: profile.user });
    if (existedProposal) {
        throw new BadRequestError("You have already submitted a proposal to this job");
    }

    // check if the user already set bank account
    if (!profile.user.stripe?.bankAccounts.length) {
        throw new BadRequestError("You must set bank details first");
    }

    // check if the freelancer have enough connects to submit the proposal
    const totalConnects: number = job.connects + spentConnects;
    if (profile.roles.freelancer!.connects.connectionsCount < totalConnects) {
        throw new BadRequestError("You don't have enough connects to submit this proposal");
    }

    await Proposal.create({
        job: jobId,
        user: profile.user,
        profile: profile._id,
        coverLetter,
        estimatedTime,
        price,
        priceType: job.priceType,
        status: "pending",
        boostProposal: {
            spentConnects
        }
    });

    profile.roles.freelancer!.connects.connectionsCount -= totalConnects;
    await profile.save();

    res.status(StatusCodes.CREATED).json({ msg: "You have submitted a new proposal" });
}


//@desc action proposal (approve, reject, interview)
//@route PATCH /api/v1/proposals/:proposalId
//@access authentication (job creator only)
const actionProposal: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { status } = req.body;
    const { proposalId } = req.params;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(proposalId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // check if valid status
    const invalidStatus = isInvalidStatus(status);
    if (invalidStatus) {
        throw new BadRequestError(invalidStatus);
    }

    // unable to set the status to pending
    if (status === "pending") {
        throw new BadRequestError("Cannot set the proposal to pending");
    }

    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "_id email" });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if current user is an amployer
    if (profile.userAs !== "employer") {
        throw new UnauthorizedError("Must be an employer");
    }

    // find proposal
    const proposal = await Proposal.findById(proposalId).populate([
        { path: "job", select: "_id user title description email", populate: { path: "user", select: "email" } },
        { path: "user", select: "email stripe" }
    ]);

    // find proposal
    if (!proposal) {
        throw new BadRequestError(`Found no proposal with id ${proposalId}`);
    }

    // check if the proposal's job belong to the current employer    
    if (proposal.job.user!._id.toString() !== profile.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to these ressources");
    }

    // check if already took an action
    if (proposal.status !== "interviewing" && proposal.status !== "pending") {
        throw new BadRequestError("You have already took an action with this proposal");
    }

    // create a contract (add later)
    if (status === "approved") {
        const refs = {
            freelancer: {
                user: proposal.user,
                profile: proposal.profile
            },
            employer: {
                user: profile.user._id,
                profile: profile._id
            }
        }

        const contractInfo = {
            ...refs,
            activityType: "job",
            job: {
                jobInfo: proposal.job._id,
                title: proposal.job.title!,
                description: proposal.job.description!,
                proposal: proposal._id,
                coverLetter: proposal.coverLetter,
                priceType: proposal.priceType,
                price: proposal.price,
                estimatedTime: proposal.estimatedTime
            },
            payments: [] as {}[]
        }

        // make employer pay the fixed price
        if (proposal.priceType === "fixed") {
            const feesAmount = jobFees.creatingJobFees.type === "percent" ? (contractInfo.job.price / 100) * jobFees.creatingJobFees.amount : jobFees.creatingJobFees.amount;
            const employerFeesAmount = transferToStripeAmount(feesAmount);
            const paymentAmountWithFees = contractInfo.job.price + feesAmount;
            const employerPaymentAmount = transferToStripeAmount(paymentAmountWithFees);
            console.log({ paymentAmountWithFees });

            // create stripe product
            const jobProduct = await stripe.products.create({
                name: `Fixed price job`,
                default_price_data: {
                    currency: "usd",
                    unit_amount: employerPaymentAmount
                },
                metadata: {
                    proposalId: proposal._id.toString(),
                    employerId: proposal.job.user!._id.toString()
                }
            });

            // create a new checkout stripe session
            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                currency: "usd",
                line_items: [
                    {
                        price: jobProduct.default_price?.toString(),
                        quantity: 1
                    }
                ],
                customer_email: proposal.job.user!.email,
                // payment_intent_data: {
                //     on_behalf_of: proposal.user.stripe?.id
                // },
                client_reference_id: profile.user._id.toString(),
                success_url: `${origin}/profile/employer/proposals/${proposal._id.toJSON()}/pay/fixed-price?session_id={CHECKOUT_SESSION_ID}&job_id=${proposal.job._id.toString()}`,
                cancel_url: "http://localhost:5173",
                metadata: {
                    productId: jobProduct.id,
                    proposalId: proposal._id.toString(),
                    employerFeesAmount,
                    employerEmail: proposal.job.user!.email!,
                    freelancerEmail: proposal.user.email!
                }
            });

            // set the stripe session id to check it later if it has been paid or not
            proposal.sessionId = session.id;
            await proposal.save();

            // redirect to the session url for employer to make the payment
            return res.status(StatusCodes.OK).json({
                status,
                priceType: proposal.priceType,
                url: session.url!
            });
        }

        // send hourly price proposal approved email to the employer
        sendProposalApprovedEmail.hourlyPriceProposal({
            userAs: "employer",
            email: proposal.job.user!.email!,
            proposalId: proposal._id.toString(),
            jobTitle: proposal.job.title!,
            price: contractInfo.job.price
        });

        // send hourly price proposal approved email to the freelancer
        sendProposalApprovedEmail.hourlyPriceProposal({
            userAs: "freelancer",
            email: proposal.user.email!,
            proposalId: proposal._id.toString(),
            jobTitle: proposal.job.title!,
            price: contractInfo.job.price
        });

        await Contract.create(contractInfo);
    }

    // update the proposal status if its not approved
    await proposal.updateOne({ status });

    const msg = status === "interviewing" ? `Proposal id ${proposalId} is now in interview mode` : `Proposal id ${proposalId} has been ${status}`;

    res.status(StatusCodes.OK).json({ msg, status });
}


//@desc set fixed price job as paid when an employer accepts and pay a proposal
//@route GET /api/v1/proposals/:proposalId/fixed-job
//@access authentication (job creator only)
const setAsPaidFixedPriceJob: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { proposalId } = req.params;
    const { session_id } = req.query;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(proposalId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid ID");
    }

    // find the proposal
    const proposal = await Proposal.findById(proposalId).populate([
        { path: "job", select: "_id user title description email", populate: { path: "user", select: "email" } },
        { path: "user", select: "email" }
    ]);

    if (!proposal) {
        throw new NotFoundError(`Found no proposal with ID ${proposalId}`);
    }

    // check if proposal is a fixed price job
    if (proposal.priceType !== "fixed") {
        throw new BadRequestError("Must be a fixed price job");
    }

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user have access to this proposal 
    if (proposal.job.user!._id.toString() !== profile.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to this proposal");
    }

    // check if session_id is provided
    if (!session_id) {
        throw new BadRequestError("Session ID is required");
    }

    // check if session id exist
    if (!proposal.sessionId) {
        throw new BadRequestError("You must make the payment process first");
    }

    // check if valid session id
    if (proposal.sessionId !== session_id?.toString()) {
        throw new BadRequestError("Invalid session ID");
    }

    // check if the contract has already been created
    const contract = await Contract.findOne({ "job.proposal": proposal._id.toString() });
    if (contract) {
        throw new BadRequestError("This proposal has already been paid");
    }

    // find the stripe sesssion
    const session = await stripe.checkout.sessions.retrieve(proposal.sessionId);
    if (!session) {
        throw new BadRequestError(`Found no session with ID ${session_id.toString()}`);
    }

    // check if employer already paid
    if (session.payment_status !== "paid") {
        throw new BadRequestError("You must pay first to accept the proposal");
    }

    // get charge id
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent!.toString());
    const chargeId = paymentIntent.latest_charge?.toString();

    // get paid at
    const paidAt = new Date(paymentIntent.created * 1000).toString();

    const refs = {
        freelancer: {
            user: proposal.user,
            profile: proposal.profile
        },
        employer: {
            user: profile.user._id,
            profile: profile._id
        }
    }

    // get freelancer net amount
    const freelancerNetAmount = jobFeeTiers.getFixedJobFeeTier({
        amount: proposal.price
    });

    const employerPaidAmount = paymentIntent.amount / 100;


    const contractInfo = {
        ...refs,
        activityType: "job",
        job: {
            jobInfo: proposal.job._id,
            title: proposal.job.title!,
            description: proposal.job.description!,
            proposal: proposal._id,
            coverLetter: proposal.coverLetter,
            priceType: proposal.priceType,
            price: proposal.price,
            estimatedTime: proposal.estimatedTime
        },
        payments: [
            {
                amount: proposal.price,
                employer: {
                    status: "paid",
                    at: paidAt,
                    net: employerPaidAmount
                },
                freelancer: {
                    status: "pending",
                    at: paidAt,
                    net: freelancerNetAmount
                },
                sessionId: session.id,
                chargeId
            }
        ]
    }

    await Contract.create(contractInfo);

    sendProposalApprovedEmail.fixedPriceProposal({
        userAs: "employer",
        email: proposal.job.user!.email!,
        proposalId: proposal._id.toString(),
        jobTitle: proposal.job.title!,
        price: contractInfo.job.price,
        totalAmoutWithFees: session.amount_total! / 100
    });

    // send fixed price proposal approved email to the freelancer
    sendProposalApprovedEmail.fixedPriceProposal({
        userAs: "freelancer",
        email: proposal.user.email!,
        proposalId: proposal._id.toString(),
        jobTitle: proposal.job.title!,
        price: contractInfo.job.price
    });

    // set proposal to approved
    proposal.status = "approved";
    await proposal.save();

    res.status(StatusCodes.OK).json({ msg: `$${contractInfo.job.price} fixed price job has been paid successfully` });
}


//@desc get all proposals related to the current freelancer
//@route GET /api/v1/proposals/profile/freelancer-proposals
//@access authentication (freelancers only)
const getFreelancerProposals: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { status, page } = req.query;

    // find user
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the current user is a freelancer
    if (profile.userAs !== "freelancer") {
        throw new UnauthorizedError("Only freelancers have access to thier proposals");
    }

    const aggregate: PipelineStage[] = [
        {
            $match: {
                profile: profile._id // find only proposals related to this freelancer
            }
        },
        {
            $lookup: {
                from: "jobs",
                foreignField: "_id",
                localField: "job",
                as: "job"
            }
        },
        {
            $unwind: "$job"
        },
        {
            $lookup: {
                from: "contracts",
                foreignField: "job.proposal",
                localField: "_id",
                as: "contracts"
            }
        },
        {
            $addFields: {
                contract: {
                    $first: "$contracts"
                }
            }
        },
        {
            $project: {
                _id: 1,
                coverLetter: 1,
                priceType: 1,
                price: 1,
                status: 1,
                boostProposal: 1,
                createdAt: 1,
                "job._id": 1,
                "job.title": 1,
                "job.category": 1,
                "job.locationType": 1,
                "contract._id": 1
            }
        },
        {
            $sort: {
                createdAt: -1 // sort by newest proposals
            }
        }
    ]

    // display proposals by the status
    const invalidStatus = isInvalidStatus(status?.toString());
    if (!invalidStatus) {
        aggregate.push({
            $match: {
                status: status!.toString()
            }
        })
    }

    // add pagination
    const CURRENT_PAGE = /^\d+$/.test(page?.toString() || "") ? +page!.toString() : 1;
    const LIMIT = 8;
    const SKIP = (CURRENT_PAGE - 1) * LIMIT;
    const paginationPipline: PipelineStage[] = [
        {
            $skip: SKIP // the amount to be skiped by each page
        },
        {
            $limit: LIMIT // the amount of proposals to be displayed
        }
    ];
    aggregate.push(...paginationPipline);


    const aggregateProposals = await Proposal.aggregate(aggregate);

    res.status(StatusCodes.OK).json(aggregateProposals);
}


export {
    getProposals,
    createProposal,
    actionProposal,
    setAsPaidFixedPriceJob,
    getFreelancerProposals
}

