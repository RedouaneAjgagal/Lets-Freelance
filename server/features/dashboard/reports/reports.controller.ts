import { StatusCodes } from "http-status-codes";
import { reportModel as Report } from "../../report";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import { getValidDuration } from "../validators/getValidQueries";
import getDuration from "../utils/getDuration";
import mongoose from "mongoose";
import getMongodbDateFormat from "../utils/getMongodbDateFormat";
import aggregatePercentage from "../utils/aggregatePercentage";


//@desc reports analysis (createdAt, report events)
//@route GET /api/v1/reports/analysis/report
//@access authorization (admins & owners)
const getReportAnalysis: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { created_report_duration } = req.query;

    const match: mongoose.PipelineStage.Match["$match"] = {};

    let dateFormat = "%Y";

    if (created_report_duration) {
        const durationKey = getValidDuration(created_report_duration.toString());
        const durationDate = getDuration(durationKey);

        match.createdAt = {
            $gte: durationDate
        }

        dateFormat = getMongodbDateFormat(durationKey);
    }

    const [reports] = await Report.aggregate([
        {
            $facet: {
                "totalReports": [
                    {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                "reportedAt": [
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
                "reportedEvents": [
                    {
                        $match: match
                    },
                    {
                        $group: {
                            _id: "$event",
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
                totalReports: {
                    $first: "$totalReports.count"
                }
            }
        },
        {
            $addFields: {
                totalDurationReports: {
                    $sum: "$reportedAt.count"
                }
            }
        },
        {
            $addFields: {
                reportedEvents: aggregatePercentage({
                    input: "$reportedEvents",
                    total: "$totalDurationReports"
                })
            }
        }
    ]);

    res.status(StatusCodes.OK).json(reports);
}

const reportControllers = {
    getReportAnalysis
}

export default reportControllers;