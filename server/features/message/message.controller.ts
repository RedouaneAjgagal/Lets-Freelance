import WebSocket from "ws";
import { User } from "../../middlewares/authentication";
import { IncomingMessage } from "http";

interface CustomAuthRequest extends IncomingMessage {
    user?: User;
}


const messageHandler = (wss: WebSocket.Server) => {
    const connectedUser: { [key: string]: WebSocket } = {};

    wss.on("connection", (ws, req: CustomAuthRequest) => {
        const userId = req.user!.userId;

        console.log(`User ${userId} connected`);
        
        connectedUser[userId] = ws;

        // Handle incoming messages
        ws.on('message', (message: string) => {
            const { receiverId, content } = JSON.parse(message.toString());

            const msg = {
                senderId: userId,
                content
            };

            if (connectedUser[receiverId]) {
                console.log({
                    msg: `SENT from ${userId} to ${receiverId}`,
                    content
                });


                connectedUser[receiverId].send(JSON.stringify(msg));
            } else {
                console.log(`User ${receiverId} is not connected`);
            }

            connectedUser[userId].send(JSON.stringify(msg))
        });

        // Handle disconnection event
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
};

export {
    messageHandler
}