import { StatusCodes } from "http-status-codes";
import { jobModel as Job } from "../../job";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import mongoose from "mongoose";
import { getValidDuration } from "../validators/getValidQueries";
import getDuration from "../utils/getDuration";
import getMongodbDateFormat from "../utils/getMongodbDateFormat";
import priceLevelJobs from "../utils/priceLevelJobs";
import aggregatePercentage from "../utils/aggregatePercentage";


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

    const getHourlyPrices = (priceLevel: "low" | "mid") => {
        const { min, max } = priceLevelJobs.hourlyJob[priceLevel];
        const match: mongoose.PipelineStage.Match["$match"] = {
            $and: [
                { $gt: ["$priceAvg", min] },
                { $lte: ["$priceAvg", max] }
            ]
        };

        return match
    }

    const getFixedPrices = (priceLevel: "low" | "mid" | "high") => {
        const { min, max } = priceLevelJobs.fixedJob[priceLevel];
        const match: mongoose.PipelineStage.Match["$match"] = {
            $and: [
                { $gt: ["$priceAvg", min] },
                { $lte: ["$priceAvg", max] }
            ]
        };

        return match
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
                ],
                "hourlyJobs": [
                    {
                        $match: {
                            $and: [
                                match,
                                { priceType: "hourly" }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            priceAvg: {
                                $divide: [
                                    { $add: ["$price.min", "$price.max"] }
                                    ,
                                    2
                                ]
                            }
                        }
                    },
                    {
                        $addFields: {
                            priceLevel: {
                                $cond: [
                                    getHourlyPrices("low"),
                                    "low",
                                    {
                                        $cond: [
                                            getHourlyPrices("mid"),
                                            "mid",
                                            "high"
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$priceLevel",
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
                ],
                "fixedJobs": [
                    {
                        $match: {
                            $and: [
                                match,
                                { priceType: "fixed" }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            priceAvg: "$price.min"
                        }
                    },
                    {
                        $addFields: {
                            priceLevel: {
                                $cond: [
                                    getFixedPrices("low"),
                                    "low",
                                    {
                                        $cond: [
                                            getFixedPrices("mid"),
                                            "mid",
                                            {
                                                $cond: [
                                                    getFixedPrices("high"),
                                                    "high",
                                                    "superHigh"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$priceLevel",
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
                jobTypes: aggregatePercentage({
                    input: "$jobTypes",
                    total: "$totalDurationJobs"
                })
            }
        },
        {
            $addFields: {
                totalHourlyJobs: {
                    $sum: "$hourlyJobs.count"
                }
            }
        },
        {
            $addFields: {
                hourlyJobs: aggregatePercentage({
                    input: "$hourlyJobs",
                    total: "$totalHourlyJobs"
                })
            }
        },
        {
            $addFields: {
                totalFixedJobs: {
                    $sum: "$fixedJobs.count"
                }
            }
        },
        {
            $addFields: {
                fixedJobs: aggregatePercentage({
                    input: "$fixedJobs",
                    total: "$totalFixedJobs"
                })
            }
        }
    ]);


    res.status(StatusCodes.OK).json(jobs);
}

const jobControllers = {
    getJobsAnalysis
}

export default jobControllers;