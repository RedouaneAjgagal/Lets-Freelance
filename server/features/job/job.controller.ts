import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, TooManyRequestsError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import { User } from "../auth";
import createJobValidator from "./validators/createJobValidator";
import userAsPermission from "../../helpers/userAsOnly";
import Job, { JobType } from "./job.model";
import getUpdatedJobInfo from "./helpers/getUpdatedJobInfo";


//@desc get all jobs info
//@route GET /api/v1/jobs
//@access public
const getAllJobs: RequestHandler = (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "All jobs" });
}


//@desc get single job info
//@route GET /api/v1/jobs/:jobId
//@access public
const singleJob: RequestHandler = (req, res) => {
    res.status(StatusCodes.OK).json({ msg: "Single job" });
}


//@desc create a new job
//@route POST /api/v1/jobs
//@access authentication (employers only)
const createJob: RequestHandler = async (req: CustomAuthRequest, res) => {
    const inputs = req.body;

    // check if valid inputs
    createJobValidator(inputs);

    // find user
    const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "userAs" });
    if (!user) {
        throw new UnauthenticatedError("Found no user");
    }

    // check if the user is a employer
    userAsPermission({
        permissionedRole: "employer",
        currentUserRole: user.profile!.userAs!
    });


    // get all job info
    const jobInfo: JobType = {
        user: user._id,
        profile: user.profile!._id,
        title: inputs.title,
        description: inputs.description,
        category: inputs.category,
        priceType: inputs.priceType,
        price: inputs.price,
        locationType: inputs.locationType,
        duration: inputs.duration,
        weeklyHours: inputs.weeklyHours,
        experienceLevel: inputs.experienceLevel,
        tags: inputs.tags
    }

    // create job
    await Job.create(jobInfo);

    res.status(StatusCodes.CREATED).json({ msg: "You have created a job successfully" });
}


//@desc update job
//@route GET /api/v1/jobs/:jobId
//@access authentication
const updateJob: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { jobId } = req.params;
    if (!jobId || jobId.trim() === "") {
        throw new BadRequestError("Must provide job id");
    }

    // find job
    const job = await Job.findById(jobId);
    if (!job) {
        throw new NotFoundError(`Found no job with id ${jobId}`);
    }

    // check if belongs to the current user
    if (job.user._id.toString() !== req.user!.userId) {
        throw new UnauthorizedError("You dont have access to update this job");
    }


    const inputs = req.body;
    // get the updated valid job info
    const updatedJobInfo = getUpdatedJobInfo({
        inputs,
        jobPriceType: job.priceType
    });

    // update the job
    await job.updateOne(updatedJobInfo);

    res.status(StatusCodes.OK).json({ msg: "You have updated the job successfully" });
}


//@desc delete job
//@route GET /api/v1/jobs/:jobId
//@access authentication
const deleteJob: RequestHandler = (req: CustomAuthRequest, res) => {
    res.status(StatusCodes.OK).json({ msg: "delete a job" });
}



export {
    getAllJobs,
    singleJob,
    createJob,
    updateJob,
    deleteJob
}