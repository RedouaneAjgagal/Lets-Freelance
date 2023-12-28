import { StatusCodes } from "http-status-codes";
import { advertisementModels } from "../../advertisement";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import mongoose from "mongoose";
import { getValidDuration } from "../validators/getValidQueries";
import getDuration from "../utils/getDuration";
import getMongodbDateFormat from "../utils/getMongodbDateFormat";
import aggregatePercentage from "../utils/aggregatePercentage";


//@desc count users (createdAt, verifiedAt)
//@route GET /api/v1/auth/users
//@access authorization (admins & owners)
const getCampaignAnalysis: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { created_campaign_duration } = req.query;

    let dateFormat = "%Y";

    const match: mongoose.PipelineStage.Match["$match"] = {};

    if (created_campaign_duration) {
        const durationKey = getValidDuration(created_campaign_duration.toString());
        const durationDate = getDuration(durationKey);
        match.createdAt = {
            $gte: durationDate
        }

        dateFormat = getMongodbDateFormat(durationKey);
    }

    const now = new Date();


    const budgetLevelsMatch = ({ type, level }: { type: "total" | "daily", level: "low" | "mid" }) => {
        const dailyLevel = {
            low: {
                min: 0,
                max: 5
            },
            mid: {
                min: 5,
                max: 25
            }
        } as const;

        const totalLevel = {
            low: {
                min: 0,
                max: 20
            },
            mid: {
                min: 20,
                max: 100
            }
        } as const;

        const levelTypes = {
            total: totalLevel,
            daily: dailyLevel
        } as const

        const match = {
            $and: [
                { $gt: ["$budget", levelTypes[type][level].min] },
                { $lte: ["$budget", levelTypes[type][level].max] }
            ]
        }

        return match;
    }

    const containAdsMatch = (level: "one" | "three_and_less" | "nine_and_less" | "ten") => {
        const levels = {
            "one": {
                min: 1,
                max: 1
            },
            "three_and_less": {
                min: 2,
                max: 3
            },
            "nine_and_less": {
                min: 4,
                max: 9
            },
            "ten": {
                min: 10,
                max: 10
            }
        }

        const match = {
            $and: [
                { $gte: [{ $size: "$ads" }, levels[level].min] },
                { $lte: [{ $size: "$ads" }, levels[level].max] }
            ]
        }

        return match;
    }

    const campaigns = await advertisementModels.Campaign.aggregate([
        {
            $facet: {
                "totalCampaigns": [
                    {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                "durationCampaigns": [
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
                "statusCampaigns": [
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
                "activeCampaignsRange": [
                    {
                        $match: {
                            $and: [
                                match,
                                { status: "active" }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            isTodayRange: {
                                $cond: [
                                    {
                                        $and: [
                                            { $lte: ["$startDate", now] },
                                            { $gte: ["$endDate", now] }
                                        ]
                                    },
                                    "inTodayRange",
                                    "notInTodayRange"
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$isTodayRange",
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
                "campaignTypes": [
                    {
                        $match: match
                    },
                    {
                        $group: {
                            _id: "$budgetType",
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
                "dailyBudgetCampaigns": [
                    {
                        $match: {
                            $and: [
                                match,
                                { budgetType: "daily" }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            budgetLevels: {
                                $cond: [budgetLevelsMatch({ type: "daily", level: "low" }), "low",
                                {
                                    $cond: [budgetLevelsMatch({ type: "daily", level: "mid" }), "mid", "high"]
                                }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$budgetLevels",
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
                "totalBudgetCampaigns": [
                    {
                        $match: {
                            $and: [
                                match,
                                { budgetType: "total" }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            budgetLevels: {
                                $cond: [budgetLevelsMatch({ type: "total", level: "low" }), "low",
                                {
                                    $cond: [budgetLevelsMatch({ type: "total", level: "mid" }), "mid", "high"]
                                }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$budgetLevels",
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
                "containAds": [
                    {
                        $match: match
                    },
                    {
                        $addFields: {
                            status: {
                                $cond: [containAdsMatch("one"), "one",
                                {
                                    $cond: [containAdsMatch("three_and_less"), "three_and_less",
                                    {
                                        $cond: [containAdsMatch("nine_and_less"), "nine_and_less",
                                            "ten"
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
                ]
            }
        },
        {
            $addFields: {
                totalCampaigns: {
                    $first: "$totalCampaigns.count"
                }
            }
        },
        {
            $addFields: {
                totalDurationCampaigns: {
                    $sum: "$durationCampaigns.count"
                }
            }
        },
        {
            $addFields: {
                durationCampaigns: aggregatePercentage({ input: "$durationCampaigns", total: "$totalDurationCampaigns" })
            }
        },
        {
            $addFields: {
                statusCampaigns: aggregatePercentage({ input: "$statusCampaigns", total: "$totalDurationCampaigns" })
            }
        },
        {
            $addFields: {
                totalActiveCampaigns: {
                    $sum: "$activeCampaignsRange.count"
                }
            }
        },
        {
            $addFields: {
                activeCampaignsRange: aggregatePercentage({ input: "$activeCampaignsRange", total: "$totalActiveCampaigns" })
            }
        },
        {
            $addFields: {
                campaignTypes: aggregatePercentage({ input: "$campaignTypes", total: "$totalDurationCampaigns" })
            }
        },
        {
            $addFields: {
                totalDailyBudgetCampaigns: {
                    $sum: "$dailyBudgetCampaigns.count"
                }
            }
        },
        {
            $addFields: {
                dailyBudgetCampaigns: aggregatePercentage({ input: "$dailyBudgetCampaigns", total: "$totalDailyBudgetCampaigns" })
            }
        },
        {
            $addFields: {
                totalTotalBudgetCampaigns: {
                    $sum: "$totalBudgetCampaigns.count"
                }
            }
        },
        {
            $addFields: {
                totalBudgetCampaigns: aggregatePercentage({ input: "$totalBudgetCampaigns", total: "$totalTotalBudgetCampaigns" })
            }
        },
        {
            $addFields: {
                containAds: aggregatePercentage({ input: "$containAds", total: "$totalDurationCampaigns" })
            }
        }
    ]);

    res.status(StatusCodes.OK).json(campaigns);
}

const campaignControllers = {
    getCampaignAnalysis
}

export default campaignControllers;