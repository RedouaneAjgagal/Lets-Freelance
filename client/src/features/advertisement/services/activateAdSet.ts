import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api";

type Status = "active" | "inactive";

type ActivateAdSetPayload = {
    adId: string;
    status: Status;
};

type ActivateAdSetResponse = {
    status: Status;
};

const activateAdSet = async (payload: ActivateAdSetPayload) => {
    const response: AxiosResponse<Promise<ActivateAdSetResponse>> = await patchRequest(`advertisements/ads/${payload.adId}`, {
        status: payload.status
    });

    const data = await response.data;
    return data;
}

export default activateAdSet;