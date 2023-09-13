import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";


//@desc get all contracts related to the current user
//@route GET /api/v1/contracts
//@access authentication
const getContracts: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "all contracts" });
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
const cancelContract: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "cancel contract" });
}


export {
    getContracts,
    cancelContract,
    cancelationRequests,
    updateContract
}