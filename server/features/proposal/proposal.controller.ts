import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";


//@desc get all proposals related to job
//@route get /api/v1/proposals
//@access authentication (job creator only)
const getProposals: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "All proposals" });
}


//@desc create a proposal for a job 
//@route POST /api/v1/proposals
//@access authentication (freelancers only)
const createProposal: RequestHandler = async (req, res) => {
    res.status(StatusCodes.CREATED).json({ msg: "New proposal" });
}


//@desc action proposal (approve, reject, interview)
//@route PATCH /api/v1/proposals/:proposalId
//@access authentication (job creator only)
const actionProposal: RequestHandler = async (req, res) => {
    res.status(StatusCodes.CREATED).json({ msg: "action proposal" });
}

export {
    getProposals,
    createProposal,
    actionProposal
}

