import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { isValidObjectId } from "mongoose";
import { BadRequestError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import createProposalValidator from "./validators/createProposalValidator";
import Proposal from "./proposal.model";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import { jobModel as Job } from "../job";


//@desc get all proposals related to job
//@route get /api/v1/proposals
//@access authentication (job creator only)
const getProposals: RequestHandler = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "All proposals" });
}


//@desc create a proposal for a job 
//@route POST /api/v1/proposals
//@access authentication (freelancers only)
const createProposal: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { jobId, coverLetter, estimatedTime, price, priceType } = req.body;

    // check if valid inputs
    createProposalValidator({ coverLetter, estimatedTime, price, priceType });

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
    const profile = await Profile.findOne({ user: req.user!.userId });
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

    // check if already submitted a proposal
    const existedProposal = await Proposal.findOne({ job: jobId, user: profile.user });
    if (existedProposal) {
        throw new BadRequestError("You have already submitted a proposal to this job");
    }

    await Proposal.create({
        job: jobId,
        user: profile.user,
        profile: profile._id,
        coverLetter,
        estimatedTime,
        price,
        priceType,
        status: "pending"
    });

    res.status(StatusCodes.CREATED).json({ msg: "You have submitted a new proposal" });
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

