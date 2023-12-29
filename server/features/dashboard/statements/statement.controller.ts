import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import mongoose from "mongoose";
import { getValidDuration } from "../validators/getValidQueries";
import getDuration from "../utils/getDuration";
import getMongodbDateFormat from "../utils/getMongodbDateFormat";
import Contract from "../../contract/contract.model";


//@desc get service revenues
//@route GET /api/v1/statements/services
//@access authorization (owners only)
const getServiceStatements: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { payment_duration } = req.query;

    const match: mongoose.PipelineStage.Match["$match"] = {
        $and: [
            { activityType: "service" },
            { payments: { $ne: [] } }
        ]
    };

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
                $group: {
                    _id: "$at",
                    count: {
                        $sum: 1
                    },
                    amount: {
                        $sum: "$payment.amount"
                    }
                }
            }
        ];

        aggregateFacet[facetName] = facet;
    });


    const contracts = await Contract.aggregate([
        {
            $facet: aggregateFacet
        }
    ]);


    res.status(StatusCodes.OK).json(contracts);
}

const statementControllers = {
    getServiceStatements
}

export default statementControllers;