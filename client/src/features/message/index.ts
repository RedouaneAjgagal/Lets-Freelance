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
import useSetInitialMessageMutation from "./hooks/useSetInitialMessageMutation";
import LoadingMessages from "./components/LoadingMessages";
import SingleJobHeader from "../job/components/SingleJobHeader";

export {
    MessagesContainer,
    websocketMessageReducer,
    websocketMessageAction,
    websocketMiddleware,
    connectWebsocket,
    disconnectWebsocket,
    sendWebsocketMessage,
    useGetMessagesQuery,
    ContactMessagesContainer,
    useSetInitialMessageMutation,
    LoadingMessages,
    SingleJobHeader
}

export type {
    GetMessagesPayload,
    MessagesResponse,
    GetContactMessagesResponse
}