import { StatusCodes } from "http-status-codes";
import { serviceModel as Service } from "../../service";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import { getValidDuration } from "../validators/getValidQueries";
import getMongodbDateFormat from "../utils/getMongodbDateFormat";
import mongoose from "mongoose";
import getDuration from "../utils/getDuration";
import getRating from "../utils/getRating";
import aggregatePercentage from "../utils/aggregatePercentage";


//@desc services analysis (createdAt, ratings)
//@route GET /api/v1/services/analysis/service
//@access authorization (admins & owners)
const getServicesAnalysis: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { created_service_duration } = req.query;

    const match: mongoose.PipelineStage.Match["$match"] = {};
    let dateFormat = "%Y";

    // search by createdAt
    if (created_service_duration) {
        const duration = getValidDuration(created_service_duration.toString());
        const durationDate = getDuration(duration);
        match.createdAt = {
            $gte: durationDate
        }

        dateFormat = getMongodbDateFormat(duration);
    }

    // get match rating based on low, mid or high rates
    const matchRating = (rate: "low" | "mid" | "high") => {
        const { min, max } = getRating(rate);

        const rating: mongoose.PipelineStage.Match["$match"] = {
            $and: [
                rate === "high" ?
                    { $lte: ["$rating.avgRate", max] }
                    : { $lt: ["$rating.avgRate", max] },
                { $gte: ["$rating.avgRate", min] }
            ]
        }

        return rating;
    }


    const [services] = await Service.aggregate([
        {
            $facet: {
                "totalServices": [
                    {
                        $match: {}
                    },
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
                "ratingServices": [
                    {
                        $match: match
                    },
                    {
                        $addFields: {
                            rateType: {
                                $cond: [
                                    matchRating("high"),
                                    "high",
                                    {
                                        $cond: [
                                            matchRating("mid"),
                                            "mid",
                                            {
                                                $cond: [
                                                    matchRating("low"),
                                                    "low",
                                                    "none"
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
                            _id: "$rateType",
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
                totalServices: {
                    $first: "$totalServices.count"
                }
            }
        },
        {
            $addFields: {
                totalDurationServices: {
                    $sum: "$postedAt.count"
                }
            }
        },
        {
            $addFields: {
                ratingServices: aggregatePercentage({ input: "$ratingServices", total: "$totalDurationServices" })
            }
        }
    ]);

    res.status(StatusCodes.OK).json(services);
}

const serviceControllers = {
    getServicesAnalysis
}

export default serviceControllers;