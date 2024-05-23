import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import mongoose from "mongoose";
import { getValidDuration } from "../validators/getValidQueries";
import getDuration from "../utils/getDuration";
import getMongodbDateFormat from "../utils/getMongodbDateFormat";
import Contract from "../../contract/contract.model";
import { Profile } from "../../profile";
import { advertisementModels } from "../../advertisement";


const getRevenuesFacet = ({ contractType, payment_duration }: { contractType: "service" | "fixedJob", payment_duration: string | undefined }) => {

    const match: mongoose.PipelineStage.Match["$match"] = {
        $and: [
            { activityType: contractType === "service" ? "service" : "job" },
            { payments: { $ne: [] } }
        ]
    };

    if (contractType === "fixedJob") {
        match.$and!.push({
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
                        $subtract: ["$payment.employer.net", "$payment.freelancer.net"]
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
                        $sum: "$payment.employer.net"
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


    const [contracts] = await Contract.aggregate([
        {
            $match: match
        },
        {
            $facet: facetAggregate
        }
    ]);

    res.status(StatusCodes.OK).json(contracts);
}


//@desc get connects revenues
//@route GET /api/v1/statements/connects
//@access authorization (owners only)
const getConnectStatements: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { payment_duration } = req.query;

    let dateFormat = "%Y";

    let durationDate: Date | string = "";

    if (payment_duration) {
        const durationKey = getValidDuration(payment_duration!.toString());
        durationDate = getDuration(durationKey);
        dateFormat = getMongodbDateFormat(durationKey);
    }

    const connects = await Profile.aggregate([
        {
            $match: {
                userAs: "freelancer",
                "roles.freelancer.connects": {
                    $ne: undefined
                },
                "roles.freelancer.connects.payments": {
                    $ne: []
                }
            }
        },
        {
            $addFields: {
                paidConnects: {
                    $filter: {
                        input: "$roles.freelancer.connects.payments",
                        as: "payment",
                        cond: {
                            $eq: ["$$payment.status", "paid"]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                paidConnects: {
                    $map: {
                        input: {
                            $filter: {
                                input: "$paidConnects",
                                as: "connect",
                                cond: {
                                    $gte: ["$$connect.paidAt", durationDate]
                                }
                            }
                        },
                        as: "connect",
                        in: {
                            connectionsCount: "$$connect.connectionsCount",
                            amountPaid: "$$connect.amountPaid",
                            at: {
                                $dateToString: {
                                    format: dateFormat,
                                    date: "$$connect.paidAt"
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $match: {
                paidConnects: {
                    $ne: []
                }
            }
        },
        {
            $unwind: "$paidConnects"
        },
        {
            $group: {
                _id: "$paidConnects.at",
                paymentsCount: {
                    $sum: 1
                },
                connectionsCount: {
                    $sum: "$paidConnects.connectionsCount"
                },
                netRevenue: {
                    $sum: "$paidConnects.amountPaid"
                }
            }
        },
        {
            $sort: {
                _id: -1
            }
        }
    ]);

    res.status(StatusCodes.OK).json(connects);
}


//@desc get advertisement revenues
//@route GET /api/v1/statements/advertisements
//@access authorization (owners only)
const getAdvertisementStatements: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { payment_duration } = req.query;

    let dateFormat = "%Y";

    let durationDate: Date | string = "";

    if (payment_duration) {
        const durationKey = getValidDuration(payment_duration!.toString());
        durationDate = getDuration(durationKey);
        dateFormat = getMongodbDateFormat(durationKey);
    }

    const facetAggregate: mongoose.PipelineStage.Facet["$facet"] = {};
    const status = ["unpaid", "paid", "failed"] as const;

    status.forEach(status => {
        const facetName = `${status}Amount`;

        const facet: mongoose.PipelineStage.FacetPipelineStage[] = [
            {
                $addFields: {
                    payments: {
                        $filter: {
                            input: "$payments",
                            as: "payment",
                            cond: {
                                $eq: ["$$payment.status", status]
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
                                        $gte: ["$$payment.at", durationDate]
                                    }
                                }
                            },
                            as: "payment",
                            in: {
                                amount: "$$payment.amount",
                                at: {
                                    $dateToString: {
                                        format: dateFormat,
                                        date: "$$payment.at"
                                    }
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
                    amount: {
                        $sum: "$payments.amount"
                    }
                }
            }
        ];

        facetAggregate[facetName] = facet;
    });

    const [advertisements] = await advertisementModels.Campaign.aggregate([
        {
            $match: {
                $and: [
                    {
                        payments: { $ne: [] }
                    },
                    {
                        payments: { $ne: undefined }
                    }
                ]
            }
        },
        {
            $facet: facetAggregate
        }
    ]);

    res.status(StatusCodes.OK).json(advertisements);
}

const statementControllers = {
    getServiceStatements,
    getFixedJobStatements,
    getHourlyJobStatements,
    getConnectStatements,
    getAdvertisementStatements
}

export default statementControllers;