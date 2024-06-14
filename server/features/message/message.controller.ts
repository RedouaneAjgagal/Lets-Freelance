import { CustomAuthRequest } from "../../middlewares/authentication";
import Message, { MessageSchemaType } from "./message.model";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { Profile } from "../profile";
import { BadRequestError, UnauthenticatedError } from "../../errors";
import mongoose, { isValidObjectId } from "mongoose";

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


    const limit = 6;
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


//@desc get contact messages
//@route GET /api/v1/messages/users/:userId
//@access authentication
const getContactMessages: RequestHandler = async (req: CustomAuthRequest, res) => {
    const { userId } = req.params;

    const { cursor } = req.query;

    // check if its valid mongodb id
    const isValidMongodbId = isValidObjectId(userId);
    if (!isValidMongodbId) {
        throw new BadRequestError("Invalid ID");
    };

    // find current user
    const profile = await Profile.findOne({ user: req.user?.userId });
    if (!profile) {
        throw new UnauthenticatedError("Found no user");
    };

    // check if the user exist
    const contact = await Profile.findOne({ user: userId });
    if (!contact) {
        throw new BadRequestError("Invalid contact");
    };

    // get cursor for infinite scroll
    const cursorNum = !cursor || Number.isNaN(Number(cursor.toString()))
        ? 1
        : Number.parseInt(cursor.toString());


    // limit messages per request
    const limitMessages = 5;

    const limit = limitMessages * cursorNum; // limit based on the cursor value
    const skip = limitMessages * (cursorNum - 1); // how many messages to skip based on the cursor value


    const [aggregationMessages] = await Message.aggregate([
        {
            // get only messages between the current user and the contact user
            $match: {
                $or: [
                    {
                        $and: [
                            { user: profile.user._id },
                            { receiver: contact.user._id }
                        ]
                    },
                    {
                        $and: [
                            { user: contact.user._id },
                            { receiver: profile.user._id }
                        ]
                    }
                ]
            }
        },
        {
            $facet: {
                // add contact facet to get contact info and to calc total of messages
                contact: [
                    {
                        $addFields: {
                            contact: contact.user._id
                        }
                    },
                    {
                        $group: {
                            _id: contact.user._id,
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ],
                // get messages between the two
                messages: [
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    {
                        $limit: limit
                    },
                    {
                        $skip: skip
                    },
                    {
                        $sort: {
                            createdAt: 1
                        }
                    },
                    {
                        $addFields: {
                            isYouSender: {
                                $cond: {
                                    if: {
                                        $eq: ["$user", profile.user._id]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            user: 1,
                            receiver: 1,
                            content: 1,
                            delivered: 1,
                            isYouSender: 1,
                            createdAt: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                contact: {
                    $first: "$contact"
                }
            }
        },
        {
            // get the total messages between the two
            $addFields: {
                totalMessages: "$contact.count"
            }
        },
        {
            // return next cursor value if there is still messages for the next cursor else return undefined
            $addFields: {
                nextCursor: {
                    $cond: {
                        if: {
                            $gt: ["$totalMessages", limit]
                        },
                        then: cursorNum + 1,
                        else: undefined
                    }
                }
            }
        },
        {
            // populate profile to grab info such as (name, avatar)
            $lookup: {
                from: "profiles",
                localField: "contact._id",
                foreignField: "user",
                as: "contact",
            }
        },
        {
            $addFields: {
                contact: {
                    $first: "$contact"
                }
            }
        },
        {
            $project: {
                messages: 1,
                nextCursor: 1,
                "contact._id": 1,
                "contact.user": 1,
                "contact.name": 1,
                "contact.avatar": 1
            }
        }
    ]);

    res.status(StatusCodes.OK).json(aggregationMessages);
}

export {
    getMessages,
    getContactMessages
}