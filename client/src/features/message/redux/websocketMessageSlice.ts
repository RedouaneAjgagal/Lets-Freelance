import { createSlice, createAction } from "@reduxjs/toolkit";

type MessageType = {
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


type WebSocketMessagesInitialStateType = {
    connected: boolean;
    message: MessageType | undefined;
}

const webSocketMessagesInitialState: WebSocketMessagesInitialStateType = {
    connected: false,
    message: undefined
}

const websocketMessageSlice = createSlice({
    initialState: webSocketMessagesInitialState,
    name: "webSocketMessages",
    reducers: {
        websocketConnected(state) {
            state.connected = true;
            return state;
        },
        websocketDisconnected(state) {
            state.connected = false;
            return state;
        },
        websocketMessageReceived(state, action: {
            payload: WebSocketMessagesInitialStateType["message"],
            type: string
        }) {
            state.message = action.payload;
            return state;
        },
        clearMessage(state) {
            state.message = undefined;
            return state;
        }
    }
});

export const connectWebsocket = createAction<{ userId: string }>("websocket/connect");
export const disconnectWebsocket = createAction("websocket/disconnect");
export const sendWebsocketMessage = createAction<{
    receiver: string;
    content: string
}>("websocket/send");

export const websocketMessageAction = websocketMessageSlice.actions;
export default websocketMessageSlice.reducer;