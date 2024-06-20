import { User } from "../../middlewares/authentication";
import { IncomingMessage } from "http";
import WebSocket from "ws";
import mongoose, { isValidObjectId } from "mongoose";
import Message, { MessageSchemaType } from "./message.model";

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
    status: "success" | "error";
};


const handleWebSocketMessages = (wss: WebSocket.Server) => {
    const connectedUser: { [key: string]: WebSocket } = {};

    wss.on("connection", async (ws, req: CustomIncomingMessage) => {
        const userId = req.user!.userId;

        console.log(`User ${userId} connected`);

        connectedUser[userId] = ws;

        // const undeliveredMessages = await Message.find({
        //     receiver: new mongoose.Types.ObjectId(userId),
        //     delivered: false
        // }).sort("createdAt");

        // for (const undeliveredMessage of undeliveredMessages) {
        //     const sendMessageContent: SendMessageType = {
        //         senderId: undeliveredMessage.user._id.toString(),
        //         content: undeliveredMessage.content
        //     };

        //     connectedUser[userId].send(JSON.stringify(sendMessageContent));

        //     undeliveredMessage.delivered = true;
        //     undeliveredMessage.save();

        //     console.log(sendMessageContent);
        // };

        // Handle incoming messages
        ws.on('message', async (message) => {
            const { receiver, content, id } = JSON.parse(message.toString());


            const sendMessageContent: SendMessageType = {
                _id: id,
                user: userId,
                content,
                receiver,
                createdAt: new Date().toString(),
                delivered: true,
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
                delivered: true,
                content: sendMessageContent.content
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
    handleWebSocketMessages
}