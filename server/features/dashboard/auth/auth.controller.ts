import { StatusCodes } from "http-status-codes";
import { User } from "../../auth";
import { CustomAuthRequest } from "../../../middlewares/authentication";
import { RequestHandler } from "express";
import mongoose from "mongoose";
import { getValidDuration } from "../validators/getValidQueries";
import getDuration from "../utils/getDuration";



//@desc count users (createdAt, verifiedAt)
//@route GET /api/v1/auth/users
//@access authorization (admins & owners)
const getUsersAnalysis: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { created_accounts_duration, verified_accounts_duration } = req.query;

    const dateFormat = {
        day: "%Y-%m-%dT%H",
        week: "%Y-%m-%d",
        month: "%Y-%m-%d",
        year: "%Y-%m",
    } as const;


    const createdAccountsMatch: mongoose.PipelineStage.Match["$match"] = {
        $and: [
            {}
        ]
    };

    // search by created accounts duration (day / week / month / year)
    let createdAtFormat = "%Y";

    if (created_accounts_duration) {
        const durationKey = getValidDuration(created_accounts_duration.toString());
        const durationTime = getDuration(durationKey);

        createdAccountsMatch.$and!.push({
            createdAt: {
                $gte: durationTime
            }
        });

        createdAtFormat = dateFormat[durationKey];
    }


    const verifiedAccountsMatch: mongoose.PipelineStage.Match["$match"] = {
        $and: [
            {}
        ]
    };
    // search by verified accounts duration (day / week / month / year)
    let verifiedAtFormat = "%Y";

    if (verified_accounts_duration) {
        const durationKey = getValidDuration(verified_accounts_duration.toString());
        const durationTime = getDuration(durationKey);
        verifiedAccountsMatch.$and!.push({
            verifiedDate: {
                $gte: durationTime
            }
        });

        verifiedAtFormat = dateFormat[durationKey];
    }

    const aggregate: mongoose.PipelineStage[] = [
        {
            $facet: {
                "totalAccounts": [
                    {
                        $match: {}
                    },
                    {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                "createdAccounts": [
                    {
                        $match: createdAccountsMatch
                    },
                    {
                        $addFields: {
                            createdAt: {
                                $dateToString: {
                                    format: createdAtFormat,
                                    date: "$createdAt"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            createdAt: 1
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
                "verifiedAccounts": [
                    {
                        $match: verifiedAccountsMatch
                    },
                    {
                        $addFields: {
                            verifiedDate: {
                                $dateToString: {
                                    format: verifiedAtFormat,
                                    date: "$verifiedDate"
                                }
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$verifiedDate",
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $match: {
                            _id: { $ne: null }
                        }
                    },
                    {
                        $sort: {
                            _id: -1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalAccounts: {
                    $first: "$totalAccounts.count"
                }
            }
        }
    ];

    const [accounts] = await User.aggregate(aggregate);

    res.status(StatusCodes.OK).json(accounts);
}

const authControllers = {
    getUsersAnalysis
}

export default authControllers