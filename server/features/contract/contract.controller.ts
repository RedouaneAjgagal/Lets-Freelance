import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import Contract from "./contract.model";
import { isValidObjectId } from "mongoose";
import cancelContractValidator from "./validators/cancelContractValidator";


//@desc get all contracts related to the current user
//@route GET /api/v1/contracts
//@access authentication
const getContracts: RequestHandler = async (req: CustomAuthRequest, res) => {
    // find profile
    const profile = await Profile.findOne({ user: req.user!.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    const filterQuery = {
        [profile.userAs]: {
            user: profile.user._id,
            profile: profile._id
        }
    }

    // find contracts
    const contracts = await Contract.find(filterQuery);

    res.status(StatusCodes.OK).json(contracts);
}


//@desc get contract cancelation requests
//@route GET /api/v1/contracts/cancel-requests
//@access authorization (admin - owner)
const cancelationRequests: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "all cancelation request" });
}


//@desc update contract (completed or canceled)
//@route PATCH /api/v1/contracts/:contractId
//@access authentication or authorization to cancel
const updateContract: RequestHandler = async (req, res) => {
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

    const contractCancelationInfo = {
        isCancelRequest: true,
        subject,
        reason
    }

    // update contract to cancelation
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