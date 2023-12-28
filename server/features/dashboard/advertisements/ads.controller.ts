import { StatusCodes } from "http-status-codes";
import { advertisementModels } from "../../advertisement";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import mongoose from "mongoose";
import { getValidDuration } from "../validators/getValidQueries";
import getDuration from "../utils/getDuration";
import getMongodbDateFormat from "../utils/getMongodbDateFormat";
import aggregatePercentage from "../utils/aggregatePercentage";


//@desc get ad analysis (createdAt, active/inactive, ads events, bid amoutn, displaying now, orders)
//@route GET /api/v1/ads/analysis/ad
//@access authorization (admins & owners)
const getAdAnalysis: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { created_ad_duration } = req.query;

    let dateFormat = "%Y";

    const match: mongoose.PipelineStage.Match["$match"] = {};

    if (created_ad_duration) {
        const durationKey = getValidDuration(created_ad_duration.toString());
        const durationDate = getDuration(durationKey);
        match.createdAt = {
            $gte: durationDate
        };

        dateFormat = getMongodbDateFormat(durationKey);
    }

    const now = new Date();

    const [ads] = await advertisementModels.Ad.aggregate([
        {
            $facet: {
                "totalAds": [
                    {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                "durationAds": [
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
                "statusAds": [
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
                "events": [
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
                ],
                "bidAmounts": [
                    {
                        $match: match
                    },
                    {
                        $addFields: {
                            bidAmountLevel: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gt: ["$bidAmount", 0] },
                                            { $lte: ["$bidAmount", 0.4] }
                                        ]
                                    },
                                    "low",
                                    {
                                        $cond: [
                                            {
                                                $and: [
                                                    { $gt: ["$bidAmount", 0.4] },
                                                    { $lte: ["$bidAmount", 1] }
                                                ]
                                            },
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
                            _id: "$bidAmountLevel",
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
                "isDisplayingNow": [
                    {
                        $match: {
                            $and: [
                                match,
                                {
                                    status: "active"
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            amountOfAdsDisplayingNow: {
                                $size: {
                                    $filter: {
                                        input: "$displayPeriods",
                                        as: "displayPeriod",
                                        cond: {
                                            $and: [
                                                { $lte: ["$$displayPeriod.startTime", now] },
                                                { $gt: ["$$displayPeriod.endTime", now] }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        $addFields: {
                            isDisplayingNow: {
                                $cond: [
                                    {
                                        $ne: ["$amountOfAdsDisplayingNow", 0]
                                    },
                                    true,
                                    false
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$isDisplayingNow",
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
                "madeOrders": [
                    {
                        $match: {
                            $and: [
                                match,
                                {
                                    orders: { $ne: undefined }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            amountOfOrders: {
                                $size: "$orders"
                            }
                        }
                    },
                    {
                        $addFields: {
                            madeOrders: {
                                $cond: [
                                    {
                                        $ne: ["$amountOfOrders", 0]
                                    },
                                    true,
                                    false
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$madeOrders",
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
                totalAds: {
                    $first: "$totalAds.count"
                }
            }
        },
        {
            $addFields: {
                totalDurationAds: {
                    $sum: "$durationAds.count"
                }
            }
        },
        {
            $addFields: {
                statusAds: aggregatePercentage({ input: "$statusAds", total: "$totalDurationAds" })
            }
        },
        {
            $addFields: {
                events: aggregatePercentage({ input: "$events", total: "$totalDurationAds" })
            }
        },
        {
            $addFields: {
                bidAmounts: aggregatePercentage({ input: "$bidAmounts", total: "$totalDurationAds" })
            }
        },
        {
            $addFields: {
                madeOrders: aggregatePercentage({ input: "$madeOrders", total: "$totalDurationAds" })
            }
        }   
    ]);

    res.status(StatusCodes.OK).json(ads);
}

const adControllers = {
    getAdAnalysis
}

export default adControllers;