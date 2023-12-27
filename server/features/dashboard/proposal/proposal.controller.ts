import { StatusCodes } from "http-status-codes";
import { proposalModel as Proposal } from "../../proposal";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import mongoose from "mongoose";
import { getValidDuration } from "../validators/getValidQueries";
import getDuration from "../utils/getDuration";
import getMongodbDateFormat from "../utils/getMongodbDateFormat";
import aggregatePercentage from "../utils/aggregatePercentage";



//@desc proposals analysis (createdAt, status, spent connects)
//@route GET /api/v1/proposals/analysis/proposal
//@access authorization (admins & owners)
const getProposalAnalysis: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { created_proposal_duration } = req.query;

    const match: mongoose.PipelineStage.Match["$match"] = {};

    let dateFormat = "%Y";

    if (created_proposal_duration) {
        const durationKey = getValidDuration(created_proposal_duration.toString());
        const durationDate = getDuration(durationKey);

        match.createdAt = {
            $gte: durationDate
        }

        dateFormat = getMongodbDateFormat(durationKey);
    }

    const proposals = await Proposal.aggregate([
        {
            $facet: {
                "totalProposals": [
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
                "proposalTypes": [
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
                "status": [
                    {
                        $match: match
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
                "boosters": [
                    {
                        $match: match
                    },
                    {
                        $addFields: {
                            hasBoostedProposals: {
                                $cond: [
                                    {
                                        $gte: ["$boostProposal.spentConnects", 1]
                                    },
                                    true,
                                    false
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$hasBoostedProposals",
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
                "boostersTypes": [
                    {
                        $match: {
                            $and: [
                                match,
                                {
                                    "boostProposal.spentConnects": { $gte: 1 }
                                }
                            ]
                        }
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
                "topThreeBoosters": [
                    {
                        $match: match
                    },
                    {
                        $sort: {
                            "boostProposal.spentConnects": -1,
                            createdAt: -1
                        }
                    },
                    {
                        $limit: 3
                    },
                    {
                        $project: {
                            _id: 1,
                            connects: "$boostProposal.spentConnects"
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalProposals: {
                    $first: "$totalProposals.count"
                }
            }
        },
        {
            $addFields: {
                totalDurationProposals: {
                    $sum: "$postedAt.count"
                }
            }
        },
        {
            $addFields: {
                proposalTypes: aggregatePercentage({
                    input: "$proposalTypes",
                    total: "$totalDurationProposals"
                })
            }
        },
        {
            $addFields: {
                status: aggregatePercentage({
                    input: "$status",
                    total: "$totalDurationProposals"
                })
            }
        },
        {
            $addFields: {
                boosters: aggregatePercentage({
                    input: "$boosters",
                    total: "$totalDurationProposals"
                })
            }
        },
        {
            $addFields: {
                totalDurationBoostedTypes: {
                    $sum: "$boostersTypes.count"
                }
            }
        },
        {
            $addFields: {
                boostersTypes: aggregatePercentage({
                    input: "$boostersTypes",
                    total: "$totalDurationBoostedTypes"
                })
            }
        }
    ]);

    res.status(StatusCodes.OK).json(proposals);
}

const proposalControllers = {
    getProposalAnalysis
}

export default proposalControllers;