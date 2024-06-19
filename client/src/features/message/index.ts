import ContactMessagesContainer from "./components/ContactMessagesContainer";
import MessagesContainer from "./components/MessagesContainer";
import useGetMessagesQuery from "./hooks/useGetMessagesQuery";
import websocketMiddleware from "./middleware/websocketMiddleware";
import websocketMessageReducer, {
    websocketMessageAction,
    connectWebsocket,
    disconnectWebsocket,
    sendWebsocketMessage
} from "./redux/websocketMessageSlice";
import { GetMessagesPayload, MessagesResponse } from "./services/getMessages";
import { GetContactMessagesResponse } from "./services/getContactMessages";

export {
    MessagesContainer,
    websocketMessageReducer,
    websocketMessageAction,
    websocketMiddleware,
    connectWebsocket,
    disconnectWebsocket,
    sendWebsocketMessage,
    useGetMessagesQuery,
    ContactMessagesContainer
}

export type {
    GetMessagesPayload,
    MessagesResponse,
    GetContactMessagesResponse
}