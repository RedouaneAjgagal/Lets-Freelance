import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type GetContactMessagesPayload = {
    userId: string;
    cursor?: number;
};

export type GetContactMessageType = {
    _id: string;
    user: string;
    receiver: string;
    content: string;
    delivered: boolean;
    createdAt: string;
    isYouSender: boolean;
};

export type GetContactMessagesResponse = {
    contact: {
        _id: string;
        user: string;
        name: string;
        avatar: string;
    };
    nextCursor: number | null;
    messages: GetContactMessageType[];
}

const getContactMessages = (payload: GetContactMessagesPayload) => {
    return async ({ pageParam = 1 }) => {
        const formatedSearchQueries = formatSearchQueries({ cursor: pageParam });

        const response: AxiosResponse<Promise<GetContactMessagesResponse>> = await getRequest(`messages/users/${payload.userId}${formatedSearchQueries}`);

        const data = await response.data;
        return data;
    };
};

export default getContactMessages;