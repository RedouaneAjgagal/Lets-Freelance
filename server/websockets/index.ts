import http from "http";
import WebSocket from "ws";
import getUserPayload from "../utils/getUserPayload";
import cookieParser from "cookie-parser";

import { CustomAuthRequest } from "../middlewares/authentication";


const onSocketError = (err: Error) => {
    console.error(err);
}


export default (expressServer: http.Server) => {
    const websocketServer = new WebSocket.Server({
        noServer: true,
        path: "/messages"
    });

    expressServer.on("upgrade", (req, socket, head) => {
        socket.on("error", onSocketError);

        const request = req as CustomAuthRequest;
        cookieParser(process.env.COOKIE_SECRET!)(request, {} as any, () => {
            const signedToken = request.signedCookies?.accessToken;

            const user = getUserPayload({
                accessToken: signedToken || ""
            });

            if (!user) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
                return;
            }

            socket.removeListener('error', onSocketError);

            request.user = user;

            websocketServer.handleUpgrade(request, socket, head, (websocket) => {
                websocketServer.emit("connection", websocket, request);
            });
        });
    });

    return websocketServer
};