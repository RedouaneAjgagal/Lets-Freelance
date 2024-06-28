import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type GetContactMessagesPayload = {
    userId: string;
    messageId?: string;
};

export type GetContactMessageType = {
    _id: string;
    user: string;
    receiver: string;
    content: string;
    delivered: boolean;
    isSystem: boolean;
    isFirstMessage: boolean;
    isYouSender: boolean;
    createdAt: string;
};

export type GetContactMessagesResponse = {
    contact: {
        _id: string;
        user: string;
        name: string;
        avatar: string;
        connection: {
            isConnected: boolean;
            disconnectedAt: string;
        };
    };
    messages: GetContactMessageType[];
}

const getContactMessages = (payload: GetContactMessagesPayload) => {
    return async ({ pageParam = undefined }) => {
        const formatedSearchQueries = formatSearchQueries({ messageId: pageParam });

        const response: AxiosResponse<Promise<GetContactMessagesResponse>> = await getRequest(`messages/users/${payload.userId}${formatedSearchQueries}`);

        const data = await response.data;
        return data;
    };
};

export default getContactMessages;