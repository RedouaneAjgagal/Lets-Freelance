import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { isValidObjectId } from "mongoose";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import createProposalValidator from "./validators/createProposalValidator";
import Proposal from "./proposal.model";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { Profile } from "../profile";
import { jobModel as Job } from "../job";
import { isInvalidStatus } from "./validators/proposalInputValidator";
import { contractModel as Contract } from "../contract";
import sendProposalApprovedEmail from "./services/sendProposalApprovedEmail";


//@desc get all proposals related to job
//@route get /api/v1/proposals
//@access authentication (job creator only)
const getProposals: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { jobId } = req.body;

    // check if valid mongodb id
    const isValidMongodbId = isValidObjectId(jobId);
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

    // find proposals
    const proposals = await Proposal.find({ job: jobId }).populate({ path: "job", select: "_id user" });

    // check if belong to the current employer
    const isCurrentEmployerJob = proposals.every(proposal => proposal.job.user!.toString() === profile.user._id.toString());
    if (!isCurrentEmployerJob) {
        throw new UnauthorizedError("You dont have access to these ressources");
    }

    res.status(StatusCodes.OK).json(proposals);
}


//@desc create a proposal for a job 
//@route POST /api/v1/proposals
//@access authentication (freelancers only)
const createProposal: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { jobId, coverLetter, estimatedTime, price } = req.body;

    // check if valid inputs
    createProposalValidator({ coverLetter, estimatedTime, price });

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
        priceType: job.priceType,
        status: "pending"
    });

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
        { path: "user", select: "email" }
    ]);

    // find proposal
    if (!proposal) {
        throw new BadRequestError(`Found no proposal with id ${proposalId}`);
    }

    // check if the proposal's job belong to the current employer    
    if (proposal.job.user!._id.toString() !== profile.user._id.toString()) {
        throw new UnauthorizedError("You dont have access to these ressources");
    }

    // check if proposal already has been approved
    if (proposal.status === "approved") {
        throw new BadRequestError("Cannot change. Proposal has already been approved");
    }

    // take proposal action
    await proposal.updateOne({ status });

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
            }
        }

        await Contract.create(contractInfo);


        // send proposal approved email to the employer
        sendProposalApprovedEmail({
            email: proposal.job.user!.email!,
            jobTitle: proposal.job.title!,
            proposalId: proposal._id.toString(),
            userAs: "employer"
        });

        // send proposal approved email to the freelancer
        sendProposalApprovedEmail({
            email: proposal.user.email!,
            jobTitle: proposal.job.title!,
            proposalId: proposal._id.toString(),
            userAs: "freelancer"
        });
    }

    const msg = status === "interviewing" ? `Proposal id ${proposalId} is now in interview mode` : `Proposal id ${proposalId} has been ${status}`;

    res.status(StatusCodes.OK).json({ msg, status });
}

export {
    getProposals,
    createProposal,
    actionProposal
}

