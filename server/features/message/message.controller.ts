import WebSocket from "ws";
import { User } from "../../middlewares/authentication";
import { IncomingMessage } from "http";

import Message, { MessageSchemaType } from "./message.model";
import mongoose, { isValidObjectId } from "mongoose";

interface CustomAuthRequest extends IncomingMessage {
    user?: User;
}


const messageHandler = (wss: WebSocket.Server) => {
    const connectedUser: { [key: string]: WebSocket } = {};

    wss.on("connection", async (ws, req: CustomAuthRequest) => {
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

export {
    messageHandler
}