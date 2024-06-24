import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api";

type SetInitialMessageType = {
    userId: string;
    serviceId?: string;
};

type SetInitialMessageResponse = {
    msg: string;
}

const setInitialMessage = async (payload: SetInitialMessageType) => {
    const initialMessageBody: { serviceId?: string } = {};
    if (payload.serviceId) {
        initialMessageBody.serviceId = payload.serviceId;
    };

    const response: AxiosResponse<Promise<SetInitialMessageResponse>> = await postRequest(`messages/users/${payload.userId}`, initialMessageBody);

    const data = await response.data;

    return data;
};

export default setInitialMessage;