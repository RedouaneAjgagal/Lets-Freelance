import { StatusCodes } from "http-status-codes";
import { Profile } from "../../profile";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import aggregatePercentage from "../utils/aggregatePercentage";


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
                totalFreelancers: {
                    $first: "$totalFreelancers.count"
                }
            }
        },
        {
            $addFields: {
                badges: aggregatePercentage({
                    input: "$badges",
                    total: "$totalFreelancers"
                })
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


//@desc employers analysis
//@route GET /api/v1/profiles/analysis/employers
//@access authrorization (admins, owners)
const getEmployersAnalysis: RequestHandler = async (req: CustomAuthRequest, res) => {
    const [profiles] = await Profile.aggregate([
        {
            $match: {
                userAs: "employer" // get only employers
            }
        },
        {
            $facet: {
                "totalEmployers": [
                    {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                "spendOnServices": [
                    {
                        $lookup: {
                            from: "contracts",
                            localField: "_id",
                            foreignField: "employer.profile",
                            as: "contracts"
                        }
                    },
                    {
                        $match: {
                            contracts: { $ne: [] }
                        }
                    },
                    {
                        $addFields: {
                            contracts: {
                                $filter: {
                                    input: "$contracts",
                                    as: "contract",
                                    cond: {
                                        $in: ["paid", "$$contract.payments.employer.status"]
                                    }
                                }
                            }
                        }
                    },
                    {
                        $match: {
                            contracts: { $ne: [] }
                        }
                    },
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
                            _id: 0
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalEmployers: {
                    $first: "$totalEmployers.count"
                }
            }
        },
        {
            $addFields: {
                spendOnServices: {
                    $first: "$spendOnServices"
                }
            }
        },
        {
            $addFields: {
                spendOnServices: {
                    percentage: {
                        $cond: [
                            {
                                $eq: ["$totalEmployers", 0]
                            },
                            0,
                            {
                                $multiply: [
                                    { $divide: ["$spendOnServices.count", "$totalEmployers"] }
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

const profileControllers = {
    getFreelancersAnalysis,
    getEmployersAnalysis
}

export default profileControllers;