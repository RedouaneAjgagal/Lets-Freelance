import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import mongoose from "mongoose";
import { getValidDuration } from "../validators/getValidQueries";
import getDuration from "../utils/getDuration";
import getMongodbDateFormat from "../utils/getMongodbDateFormat";
import Contract from "../../contract/contract.model";


const getRevenuesFacet = ({ contractType, payment_duration }: { contractType: "service" | "fixedJob", payment_duration: string | undefined }) => {

    const andMatch: mongoose.FilterQuery<any>[] = [
        { activityType: contractType === "service" ? "service" : "job" },
        { payments: { $ne: [] } }
    ];


    const match: mongoose.PipelineStage.Match["$match"] = {
        $and: [
            { activityType: contractType === "service" ? "service" : "job" },
            { payments: { $ne: [] } }
        ]
    };

    if (contractType === "fixedJob") {
        andMatch.push({
            "job.priceType": "fixed"
        });
    }

    const durationMatch: mongoose.PipelineStage.Match["$match"] = {
        $and: [{}]
    };

    let dateFormat = "%Y";

    if (payment_duration) {
        const durationKey = getValidDuration(payment_duration!.toString());
        const durationDate = getDuration(durationKey);
        durationMatch.$and!.push({
            "payment.freelancer.at": {
                $gte: durationDate
            }
        });

        dateFormat = getMongodbDateFormat(durationKey);
    }

    const aggregateFacet: mongoose.PipelineStage.Facet["$facet"] = {};

    const status = ["pending", "paid", "refunded"] as const;

    status.forEach(status => {
        const facetName = `${status}Payments`;
        const facet: mongoose.PipelineStage.FacetPipelineStage[] = [
            {
                $match: match
            },
            {
                $addFields: {
                    payment: {
                        $first: "$payments"
                    }
                }
            },
            {
                $match: durationMatch
            },
            {
                $match: {
                    "payment.freelancer.status": status
                }
            },
            {
                $addFields: {
                    at: {
                        $dateToString: {
                            format: dateFormat,
                            date: "$payment.freelancer.at"
                        }
                    }
                }
            },
            {
                $addFields: {
                    netRevenue: {
                        $subtract: ["$payment.amount", "$payment.freelancer.net"]
                    }
                }
            },
            {
                $group: {
                    _id: "$at",
                    count: {
                        $sum: 1
                    },
                    grossRevenue: {
                        $sum: "$payment.amount"
                    },
                    netRevenue: {
                        $sum: "$netRevenue"
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ];

        aggregateFacet[facetName] = facet;
    });

    return aggregateFacet;
}

//@desc get service revenues
//@route GET /api/v1/statements/services
//@access authorization (owners only)
const getServiceStatements: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { payment_duration } = req.query;

    const facet = getRevenuesFacet({
        contractType: "service",
        payment_duration: payment_duration?.toString()
    });

    const [contracts] = await Contract.aggregate([
        {
            $facet: facet
        }
    ]);

    res.status(StatusCodes.OK).json(contracts);
}


//@desc get fixed job revenues
//@route GET /api/v1/statements/jobs/fixed
//@access authorization (owners only)
const getFixedJobStatements: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { payment_duration } = req.query;

    const facet = getRevenuesFacet({
        contractType: "fixedJob",
        payment_duration: payment_duration?.toString()
    });

    const [contracts] = await Contract.aggregate([
        {
            $facet: facet
        }
    ]);

    res.status(StatusCodes.OK).json(contracts);
}


//@desc get hourly job revenues
//@route GET /api/v1/statements/jobs/hourly
//@access authorization (owners only)
const getHourlyJobStatements: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { payment_duration } = req.query;

    const match: mongoose.PipelineStage.Match["$match"] = {
        $and: [
            { activityType: "job" },
            { payments: { $ne: [] } },
            { "job.priceType": "hourly" }
        ]
    };

    let durationMatch: Date | string = "";

    let dateFormat = "%Y";

    if (payment_duration) {
        const durationKey = getValidDuration(payment_duration!.toString());
        durationMatch = getDuration(durationKey);

        dateFormat = getMongodbDateFormat(durationKey);
    }

    const facetAggregate: mongoose.PipelineStage.Facet["$facet"] = {};

    const status = ["paid", "refunded"] as const;
    status.forEach(status => {
        const facetName = `${status}Payments`;

        const facet: mongoose.PipelineStage.FacetPipelineStage[] = [
            {
                $addFields: {
                    payments: {
                        $filter: {
                            input: "$payments",
                            as: "payment",
                            cond: {
                                $eq: ["$$payment.freelancer.status", status]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    payments: { $ne: [] }
                }
            },
            {
                $addFields: {
                    payments: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$payments",
                                    as: "payment",
                                    cond: {
                                        $gte: ["$$payment.freelancer.at", durationMatch]
                                    }
                                }
                            },
                            as: "payment",
                            in: {
                                grossRevenue: "$$payment.employer.net",
                                freelancer: "$$payment.freelancer",
                                at: {
                                    $dateToString: {
                                        format: dateFormat,
                                        date: "$$payment.freelancer.at"
                                    }
                                },
                                netRevenue: {
                                    $subtract: ["$$payment.employer.net", "$$payment.freelancer.net"]
                                }
                            }
                        }
                    }
                }
            },
            {
                $unwind: "$payments"
            },
            {
                $group: {
                    _id: "$payments.at",
                    count: {
                        $sum: 1
                    },
                    grossRevenue: {
                        $sum: "$payments.grossRevenue"
                    },
                    netRevenue: {
                        $sum: "$payments.netRevenue"
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]

        facetAggregate[facetName] = facet;
    });


    const contracts = await Contract.aggregate([
        {
            $match: match
        },
        {
            $facet: facetAggregate
        }
    ]);

    res.status(StatusCodes.OK).json(contracts);
}

const statementControllers = {
    getServiceStatements,
    getFixedJobStatements,
    getHourlyJobStatements
}

export default statementControllers;