import { CustomAuthRequest } from "../../middlewares/authentication";
import Message, { MessageSchemaType } from "./message.model";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { Profile } from "../profile";
import { UnauthenticatedError } from "../../errors";

//@desc get messages
//@route GET /api/v1/messages
//@access authentication
const getMessages: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { page, search } = req.query;

    const profile = await Profile.findOne({ user: req.user?.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    }

    const currentPage = !page ||
        Number.isNaN(Number(page.toString())) ||
        Number(page.toString()) < 1
        ? 1
        : Number.parseInt(page.toString());


    const limit = 2;
    const skip = (currentPage - 1) * limit;
    const calculatedLimit = currentPage * limit;

    const searchValue = search?.toString().trim() || "";

    const [aggregationMessages] = await Message.aggregate([
        {
            // get only messages that are related to the current login user
            $match: {
                $or: [
                    { user: profile.user._id },
                    { receiver: profile.user._id }
                ]
            }
        },
        {
            // grab the id of the user that is texting with the current login user
            $addFields: {
                nextUser: {
                    $cond: {
                        if: {
                            $eq: ["$user", profile.user._id]
                        },
                        then: "$receiver",
                        else: "$user"
                    }
                }
            }
        },
        {
            // group through all of the user's messages and get only the recent messages
            $group: {
                _id: "$nextUser",
                message: {
                    $top: {
                        output: {
                            content: "$content",
                            createdAt: "$createdAt",
                            isYouSender: {
                                $cond: {
                                    if: {
                                        $eq: ["$user", profile.user._id]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        },
                        sortBy: { "createdAt": -1 }
                    }
                },
            }
        },
        {
            // populate profile to get (_id, name, avatar)
            $lookup: {
                from: "profiles",
                localField: "_id",
                foreignField: "user",
                as: "profile"
            }
        },
        {
            $addFields: {
                profile: {
                    $first: "$profile"
                }
            }
        },
        {
            // search based on the profile name
            $match: {
                "profile.name": {
                    $regex: searchValue,
                    $options: "i"
                }
            }
        },
        {
            $project: {
                _id: 1,
                message: 1,
                "profile._id": 1,
                "profile.user": 1,
                "profile.name": 1,
                "profile.avatar": 1
            }
        },
        {
            // sort by the newest messages
            $sort: {
                "message.createdAt": -1
            }
        },
        {
            $facet: {
                messages: [
                    // add pagination
                    {
                        $limit: calculatedLimit
                    },
                    {
                        $skip: skip
                    }
                ],
                totalMessages: [
                    // get the total messages without the pagination limit
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
                totalMessages: {
                    $first: "$totalMessages.count"
                }
            }
        },
        {
            // return the next page number if there is still messages (for the frontend to add infinite query)
            $addFields: {
                nextPage: {
                    $cond: {
                        if: {
                            $gt: ["$totalMessages", calculatedLimit]
                        },
                        then: currentPage + 1,
                        else: undefined
                    }
                }
            }
        },
        {
            $project: {
                messages: 1,
                nextPage: 1
            }
        }
    ])


    res.status(StatusCodes.OK).json(aggregationMessages);
};


export {
    getMessages
}