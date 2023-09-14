import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import Contract from "./contract.model";
import { isValidObjectId } from "mongoose";
import cancelContractValidator from "./validators/cancelContractValidator";
import { User } from "../auth";
import rolePermissionChecker from "../../utils/rolePermissionChecker";
import { isInvalidStatus } from "./validators/contractInputValidator";
import sendContractCancelationEmail from "./services/sendContractCancelationEmail";


//@desc get all contracts related to the current user
//@route GET /api/v1/contracts
//@access authentication
const getContracts: RequestHandler = async (req: CustomAuthRequest, res) => {
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
                    status: "inProgress"
                }
            },
            {
                [profile.userAs === "employer" ? "freelancer.status" : "employer.status"]: "inProgress"
            }
        ]
    }, { cancelRequest: false });

    res.status(StatusCodes.OK).json(contracts);
}


//@desc get contract cancelation requests
//@route GET /api/v1/contracts/cancel-requests
//@access authorization (admin - owner)
const cancelationRequests: RequestHandler = async (req: CustomAuthRequest, res) => {
    const contracts = await Contract.find({ "cancelRequest.status": "pending", $or: [{ "freelancer.status": "inProgress" }, { "employer.status": "inProgress" }] });
    res.status(StatusCodes.OK).json(contracts);
}


//@desc update contract (completed or canceled)
//@route PATCH /api/v1/contracts/:contractId
//@access authentication or authorization to cancel
const updateContract: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { contractId } = req.params;
    const { status }: { status: "inProgress" | "completed" | "canceled" } = req.body;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(contractId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid id");
    }

    // check if valid status
    const invalidStatus = isInvalidStatus(status);
    if (invalidStatus) {
        throw new BadRequestError(invalidStatus);
    }

    // find contract
    const contract = await Contract.findById(contractId).populate({ path: "freelancer.user employer.user", select: "email" });
    if (!contract) {
        throw new NotFoundError(`Found no contract with id ${contractId}`);
    }

    // find user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "_id userAs" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    const isAlloweddRole = rolePermissionChecker({
        allowedRoles: ["admin", "owner"],
        currentRole: user.role
    });

    // check if powerful role (admin or owner) and cancel request is made
    if (isAlloweddRole && contract.cancelRequest.status === "pending") {
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

        return res.status(StatusCodes.OK).json({ msg: `Contract cancelation request has been ${requestResult}` });
    }


    // check if the current user have access to this contract
    if (contract[user.profile!.userAs!].user._id.toString() !== user._id.toString()) {
        throw new UnauthorizedError("You dont have access to these ressources");
    }

    // check if status is completed
    if (status !== "completed") {
        throw new BadRequestError("You dont have access to set status to this value");
    }

    // update contract status
    contract[user.profile!.userAs!].status = status;
    await contract.save();

    res.status(StatusCodes.OK).json({ msg: "contract completed or canceled" });
}


//@desc request a contract cancelation
//@route POST /api/v1/contracts/:contractId
//@access authentication
const cancelContract: RequestHandler = async (req: CustomAuthRequest, res) => {
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


export {
    getContracts,
    cancelContract,
    cancelationRequests,
    updateContract
}