import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, TooManyRequestsError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";


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
const createJob: RequestHandler = (req: CustomAuthRequest, res) => {
    res.status(StatusCodes.CREATED).json({ msg: "Create a job" });
}


//@desc update job
//@route GET /api/v1/jobs/:jobId
//@access authentication
const updateJob: RequestHandler = (req: CustomAuthRequest, res) => {
    res.status(StatusCodes.OK).json({ msg: "update a job" });
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