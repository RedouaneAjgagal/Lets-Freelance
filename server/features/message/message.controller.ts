import WebSocket from "ws";
import { CustomAuthRequest, User } from "../../middlewares/authentication";
import { IncomingMessage } from "http";

import Message, { MessageSchemaType } from "./message.model";
import mongoose, { isValidObjectId } from "mongoose";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { Profile } from "../profile";
import { UnauthenticatedError } from "../../errors";

interface CustomIncomingMessage extends IncomingMessage {
    user?: User;
}


const messageHandler = (wss: WebSocket.Server) => {
    const connectedUser: { [key: string]: WebSocket } = {};

    wss.on("connection", async (ws, req: CustomIncomingMessage) => {
        const userId = req.user!.userId;

        console.log(`User ${userId} connected`);

        connectedUser[userId] = ws;

        const undeliveredMessages = await Message.find({
            receiver: new mongoose.Types.ObjectId(userId),
            delivered: false
        }).sort("createdAt");

        for (const undeliveredMessage of undeliveredMessages) {
            const sendMessageContent = {
                senderId: undeliveredMessage.user._id.toString(),
                content: undeliveredMessage.content
            };

            connectedUser[userId].send(JSON.stringify(sendMessageContent));

            undeliveredMessage.delivered = true;
            undeliveredMessage.save();

            console.log(sendMessageContent);
        };

        // Handle incoming messages
        ws.on('message', async (message) => {
            const { receiver, content } = JSON.parse(message.toString());


            const sendMessageContent = {
                status: "success",
                senderId: userId,
                content,
            };

            const isValidMongodbId = isValidObjectId(receiver);
            if (!isValidMongodbId) {
                sendMessageContent.status = "error";
                sendMessageContent.content = "Error. Couldn't send";

                ws.send(JSON.stringify(sendMessageContent));
                return;
            }

            const messagePayload: MessageSchemaType = {
                user: new mongoose.Types.ObjectId(userId),
                receiver: new mongoose.Types.ObjectId(receiver),
                delivered: true,
                content
            };


            if (connectedUser[messagePayload.receiver._id.toString()]) {
                connectedUser[messagePayload.receiver._id.toString()]
                    .send(JSON.stringify(sendMessageContent));

                console.log({
                    msg: `SENT from ${userId} to ${messagePayload.receiver._id.toString()}`,
                    content
                });
            } else {
                messagePayload.delivered = false;

                console.log(`User ${messagePayload.receiver._id.toString()} is not connected`);
            }

            connectedUser[messagePayload.user._id.toString()]
                .send(JSON.stringify(sendMessageContent));

            await Message.create(messagePayload);
        });

        // Handle disconnection event
        ws.on('close', () => {
            console.log('Client disconnected');

            delete connectedUser[userId];
        });
    });
};



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
    messageHandler,
    getMessages
}