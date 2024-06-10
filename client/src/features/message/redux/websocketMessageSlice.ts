import { createSlice, createAction } from "@reduxjs/toolkit";

type MessageType = {
    senderId: string;
    content: string;
};

type WebSocketMessagesInitialStateType = {
    connected: boolean;
    messages: MessageType[];
}

const webSocketMessagesInitialState: WebSocketMessagesInitialStateType = {
    connected: false,
    messages: []
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
            payload: WebSocketMessagesInitialStateType["messages"][number],
            type: string
        }) {
            console.log(action.payload);
            
            state.messages.push(action.payload);
        }
    }
});

export const connectWebsocket = createAction<{ userId: string }>("websocket/connect");
export const disconnectWebsocket = createAction("websocket/disconnect");
export const sendWebsocketMessage = createAction<{
    receiverId: string;
    content: string
}>("websocket/send");

export const websocketMessageAction = websocketMessageSlice.actions;
export default websocketMessageSlice.reducer;