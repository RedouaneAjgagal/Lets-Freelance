import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api"
import formatSearchQueries from "../../../utils/formatSearchQueries"

export type GetMessagesPayload = {
    page?: number;
    search?: string;
}

export type MessageType = {
    _id: string;
    message: {
        content: string;
        createdAt: string;
        isSystem: boolean;
        isYouSender: boolean;
    };
    profile: {
        _id: string;
        user: string;
        name: string;
        avatar: string;
    };
};

export type MessagesResponse = {
    messages: MessageType[];
    nextPage: number | null;
}

const getMessages = (payload: GetMessagesPayload) => {
    return async ({ pageParam = 1 }) => {
        const formatedSearchQueries = formatSearchQueries({ ...payload, page: pageParam });

        const response: AxiosResponse<Promise<MessagesResponse>> = await getRequest(`messages${formatedSearchQueries}`);

        const data = await response.data;
        return data;
    }
}

export default getMessages;