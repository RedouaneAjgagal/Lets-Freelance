import { StatusCodes } from "http-status-codes";
import { contractModel as Contract } from "../../contract";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import mongoose from "mongoose";
import { getValidDuration } from "../validators/getValidQueries";
import getDuration from "../utils/getDuration";
import getMongodbDateFormat from "../utils/getMongodbDateFormat";
import aggregatePercentage from "../utils/aggregatePercentage";


//@desc contract analysis (createdAt, activity type, status, cancelation status)
//@route GET /api/v1/contracts/analysis/contract
//@access authorization (admins & owners)
const getConctractAnalysis: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { created_contract_duration } = req.query;

    const match: mongoose.PipelineStage.Match["$match"] = {};

    let dateFormat = "%Y";

    if (created_contract_duration) {
        const durationKey = getValidDuration(created_contract_duration.toString());
        const durationDate = getDuration(durationKey);

        match.createdAt = {
            $gte: durationDate
        }

        dateFormat = getMongodbDateFormat(durationKey);
    }

    const checkContractStatus = (status: "completed" | "canceled" | "inProgress") => {
        const filters = {
            completed: "$and",
            canceled: "$and",
            inProgress: "$or"
        } as const;

        const match: mongoose.PipelineStage.Match["$match"] = {
            [filters[status]]: [
                { $eq: ["$employer.status", status] },
                { $eq: ["$freelancer.status", status] }
            ]
        }

        return match;
    }

    const [contracts] = await Contract.aggregate([
        {
            $facet: {
                "totalContracts": [
                    {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                "createdContractsAt": [
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
                "contractTypes": [
                    {
                        $match: match
                    },
                    {
                        $group: {
                            _id: "$activityType",
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
                "contractStatus": [
                    {
                        $match: match
                    },
                    {
                        $addFields: {
                            status: {
                                $cond: [
                                    checkContractStatus("canceled"), "canceled",
                                    {
                                        $cond: [checkContractStatus("completed"), "completed", "inProgress"]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$status",
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
                "cancellations": [
                    {
                        $match: {
                            $and: [
                                match,
                                {
                                    $or: [
                                        { "cancelRequest.freelancer.isCancelRequest": { $eq: true } },
                                        { "cancelRequest.employer.isCancelRequest": { $eq: true } }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: "$cancelRequest.status",
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
                totalContracts: {
                    $first: "$totalContracts.count"
                }
            }
        },
        {
            $addFields: {
                contractTypes: aggregatePercentage({
                    input: "$contractTypes",
                    total: "$totalContracts"
                })
            }
        },
        {
            $addFields: {
                contractStatus: aggregatePercentage({
                    input: "$contractStatus",
                    total: "$totalContracts"
                })
            }
        },
        {
            $addFields: {
                totalCancellations: {
                    $sum: "$cancellations.count"
                }
            }
        },
        {
            $addFields: {
                cancellations: aggregatePercentage({
                    input: "$cancellations",
                    total: "$totalCancellations"
                })
            }
        }
    ])


    res.status(StatusCodes.OK).json(contracts);
}

const contractController = {
    getConctractAnalysis
}

export default contractController;