import http from "http";
import WebSocket from "ws";

export default (expressServer: http.Server) => {
    const websocketServer = new WebSocket.Server({
        noServer: true,
        path: "/messages"
    });

    expressServer.on("upgrade", (req, socket, head) => {
        websocketServer.handleUpgrade(req, socket, head, (websocket) => {
            websocketServer.emit("connection", websocket, req);
        });
    });

    return websocketServer
};