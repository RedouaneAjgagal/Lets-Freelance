import WebSocket from "ws";

//@desc get all jobs info
//@route GET /api/v1/jobs
//@access public
const messageHandler = (wss: WebSocket.Server) => {
    const connectedUser: { [key: string]: WebSocket } = {};

    wss.on("connection", (ws, req) => {
        const query = req.url?.split("?")[1];

        // req.

        const [queryName, queryValue] = JSON.stringify(query)
            .slice(0, -1)
            .slice(1)
            .split("=");

        if (queryName === "userId" && queryValue.trim() !== "") {
            connectedUser[queryValue] = ws;
            console.log(`User ${queryValue} connected`);
        }

        // Handle incoming messages
        ws.on('message', (message, a) => {
            const { receiverId, content } = JSON.parse(message.toString());

            const msg = {
                senderId: queryValue,
                content
            };

            if (connectedUser[receiverId]) {
                console.log({
                    msg: `SENT from ${queryValue} to ${receiverId}`,
                    content
                });


                connectedUser[receiverId].send(JSON.stringify(msg));
            } else {
                console.log(`User ${receiverId} is not connected`);
            }

            connectedUser[queryValue].send(JSON.stringify(msg))
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