import { StatusCodes } from "http-status-codes";
import { jobModel as Job } from "../../job";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import mongoose from "mongoose";
import { getValidDuration } from "../validators/getValidQueries";
import getDuration from "../utils/getDuration";
import getMongodbDateFormat from "../utils/getMongodbDateFormat";


//@desc jobs analysis (createdAt, job type)
//@route GET /api/v1/jobs/analysis/job
//@access authorization (admins & owners)
const getJobsAnalysis: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { created_job_duration } = req.query;

    const match: mongoose.PipelineStage.Match["$match"] = {};
    let dateFormat = "%Y";

    if (created_job_duration) {
        const durationKey = getValidDuration(created_job_duration.toString());
        const durationDate = getDuration(durationKey);

        match.createdAt = {
            $gte: durationDate
        }

        dateFormat = getMongodbDateFormat(durationKey);
    }

    const [jobs] = await Job.aggregate([
        {
            $facet: {
                "totalJobs": [
                    {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                "postedAt": [
                    {
                        $match: match
                    },
                    {
                        $addFields: {
                            createdAt: {
                                $dateToString: {
                                    format: dateFormat,
                                    date: "$createdAt"
                                }
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$createdAt",
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $sort: {
                            _id: -1
                        }
                    }
                ],
                "jobTypes": [
                    {
                        $match: match
                    },
                    {
                        $group: {
                            _id: "$priceType",
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $sort: {
                            count: -1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalJobs: {
                    $first: "$totalJobs.count"
                }
            }
        },
        {
            $addFields: {
                totalDurationJobs: {
                    $sum: "$postedAt.count"
                }
            }
        },
        {
            $addFields: {
                jobTypes: {
                    $map: {
                        input: "$jobTypes",
                        as: "jobType",
                        in: {
                            _id: "$$jobType._id",
                            count: "$$jobType.count",
                            percentage: {
                                $cond: [
                                    { $eq: ["totalDurationJobs", 0] },
                                    0,
                                    {
                                        $multiply: [
                                            { $divide: ["$$jobType.count", "$totalDurationJobs"] }
                                            ,
                                            100
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    ]);


    res.status(StatusCodes.OK).json(jobs);
}

const jobControllers = {
    getJobsAnalysis
}

export default jobControllers;