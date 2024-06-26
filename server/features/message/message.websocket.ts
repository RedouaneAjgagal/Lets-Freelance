import { User } from "../../middlewares/authentication";
import { IncomingMessage } from "http";
import WebSocket from "ws";
import mongoose, { isValidObjectId } from "mongoose";
import Message, { MessageSchemaType } from "./message.model";
import { Profile } from "../profile";

interface CustomIncomingMessage extends IncomingMessage {
    user?: User;
};

type SendMessageType = {
    _id: string;
    user: string;
    receiver: string;
    content: string;
    delivered: boolean;
    createdAt: string;
    isYouSender: boolean;
    isSystem: boolean;
    isFirstMessage: boolean;
    status: "success" | "error";
};

interface WebsocketConnectedUser extends WebSocket {
    connectionCount: number;
};

const handleWebSocketMessages = (wss: WebSocket.Server) => {
    const connectedUser: { [key: string]: WebsocketConnectedUser } = {};

    wss.on("connection", async (ws: WebsocketConnectedUser, req: CustomIncomingMessage) => {
        const userId = req.user!.userId;

        console.log(`User ${userId} connected`);

        if (connectedUser[userId]) {
            connectedUser[userId].connectionCount += 1;
        } else {
            connectedUser[userId] = ws;
            connectedUser[userId].connectionCount = 1;
            
            await Profile.findOneAndUpdate({
                user: new mongoose.Types.ObjectId(userId)
            }, {
                $set: {
                    "connection.isConnected": true
                }
            });
        };

        // Handle incoming messages
        ws.on('message', async (message) => {
            const { receiver, content } = JSON.parse(message.toString());

            const _id = new mongoose.Types.ObjectId();
            const sendMessageContent: SendMessageType = {
                _id: _id.toString(),
                user: userId,
                content,
                receiver,
                createdAt: new Date().toString(),
                delivered: true,
                isFirstMessage: false,
                isSystem: false,
                isYouSender: false,
                status: "success",
            };

            const isValidMongodbId = isValidObjectId(receiver);
            if (!isValidMongodbId || (!content || content.toString().trim() === "")) {
                sendMessageContent.status = "error";
                sendMessageContent.content = "Error. Couldn't send";
                sendMessageContent.delivered = false;

                ws.send(JSON.stringify(sendMessageContent));
                return;
            }

            const messagePayload: MessageSchemaType = {
                user: new mongoose.Types.ObjectId(sendMessageContent.user),
                receiver: new mongoose.Types.ObjectId(sendMessageContent.receiver),
                content: sendMessageContent.content,
                delivered: true,
                isSystem: false,
                isFirstMessage: false
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

            sendMessageContent.isYouSender = true;
            connectedUser[messagePayload.user._id.toString()]
                .send(JSON.stringify(sendMessageContent));

            console.log(messagePayload);

            Message.create(messagePayload);
        });

        // Handle disconnection event
        ws.on('close', async () => {
            connectedUser[userId].connectionCount -= 1;

            if (!connectedUser[userId].connectionCount) {
                console.log(`User ${userId} disconnected`);
                delete connectedUser[userId];

                await Profile.findOneAndUpdate({
                    user: new mongoose.Types.ObjectId(userId)
                }, {
                    $set: {
                        "connection.isConnected": false,
                        "connection.disconnectedAt": Date.now(),
                    }
                });
            }
        });
    });
};

export {
    handleWebSocketMessages
}