import { StatusCodes } from "http-status-codes";
import Profile from "../profile.model";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../../middlewares/authentication";


//@desc freelancers analysis
//@route GET /api/v1/profiles/analysis/freelancers
//@access authrorization (admins, owners)
const getFreelancersAnalysis: RequestHandler = async (req: CustomAuthRequest, res) => {
    const [profiles] = await Profile.aggregate([
        {
            $match: {
                userAs: "freelancer" // get only freelancers
            }
        },
        {
            $facet: {
                "totalFreelancers": [
                    {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            count: 1
                        }
                    }
                ],
                "badges": [
                    {
                        $group: {
                            _id: "$roles.freelancer.badge",
                            count: {
                                $sum: 1
                            }
                        },
                    },
                    {
                        $project: {
                            badge: "$_id",
                            count: 1
                        }
                    },
                    {
                        $sort: {
                            count: -1
                        }
                    }
                ],
                "spendOnConnects": [
                    {
                        $addFields: {
                            spendOnConnects: {
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
                        $match: {
                            $and: [
                                { spendOnConnects: { $ne: [] } },
                                { spendOnConnects: { $ne: null } }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalFreelancers: {
                    $first: "$totalFreelancers.count"
                }
            }
        },
        {
            $addFields: {
                badges: {
                    $map: {
                        input: "$badges",
                        as: "badge",
                        in: {
                            badge: "$$badge._id",
                            count: "$$badge.count",
                            percentage: {
                                $cond: [
                                    { $eq: ["$totalFreelancers", 0] },
                                    0,
                                    {
                                        $multiply: [
                                            {
                                                $divide: ["$$badge.count", { $sum: "$totalFreelancers" }]
                                            },
                                            100
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                spendOnConnects: {
                    $first: "$spendOnConnects"
                }
            }
        },
        {
            $addFields: {
                spendOnConnects: {
                    percentage: {
                        $cond: [
                            { $eq: ["$totalFreelancers", 0] },
                            0,
                            {
                                $multiply: [
                                    {
                                        $divide: ["$spendOnConnects.count", "$totalFreelancers"]
                                    }
                                    ,
                                    100
                                ]
                            }
                        ]
                    }
                }
            }
        }
    ]);

    res.status(StatusCodes.OK).json(profiles);
}

export {
    getFreelancersAnalysis
}