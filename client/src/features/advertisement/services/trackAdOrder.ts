import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api"

type TrackAdOrderPayload = {
    track: string;
    order: string;
}

type TrackAdOrderResponse = {
    msg: string;
}

const trackAdOrder = async (payload: TrackAdOrderPayload) => {
    const response: AxiosResponse<Promise<TrackAdOrderResponse>> = await patchRequest(`advertisements/performace/actions/order`, payload);

    const data = await response.data;
    return data;
}

export default trackAdOrder;