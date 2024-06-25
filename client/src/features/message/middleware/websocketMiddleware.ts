import { Middleware } from "@reduxjs/toolkit";

import {
    websocketMessageAction,
    connectWebsocket,
    disconnectWebsocket,
    sendWebsocketMessage
} from "../redux/websocketMessageSlice";
import { noApiBaseUrl } from "../../../config/baseURL";

let socket: WebSocket | undefined;

const websocketMiddleware: Middleware = (store) => (next) => (action) => {
    if (connectWebsocket.match(action)) {
        if (socket !== undefined) {
            socket.close();
        };

        const websocketUrl = `ws://${noApiBaseUrl}/messages`;

        socket = new WebSocket(websocketUrl);

        socket.onopen = () => {
            store.dispatch(websocketMessageAction.websocketConnected());
        };

        socket.onmessage = (e) => {
            const message = JSON.parse(e.data);
            store.dispatch(websocketMessageAction.websocketMessageReceived(message));
        };

        socket.onclose = () => {
            store.dispatch(websocketMessageAction.websocketDisconnected());
        };
    } else if (disconnectWebsocket.match(action)) {
        if (socket !== undefined) {
            socket.close();
        };

        socket = undefined;
        store.dispatch(websocketMessageAction.websocketDisconnected());
    } else if (sendWebsocketMessage.match(action)) {
        if (socket !== undefined && socket.readyState === WebSocket.OPEN) {            
            socket.send(JSON.stringify(action.payload));
        }
    }

    return next(action);
};

export default websocketMiddleware;