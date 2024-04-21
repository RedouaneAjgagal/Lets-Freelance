import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api";

type TrackAdClickPayload = {
    ad: string;
    track: string;
}

type TrackAdClickResponse = {
    ad_id: string;
    track_id: string;
}

const trackAdClick = async (payload: TrackAdClickPayload) => {
    const response: AxiosResponse<Promise<TrackAdClickResponse>> = await patchRequest(`advertisements/performace/actions/click`, payload);

    const data = await response.data;
    return data;
}

export default trackAdClick;