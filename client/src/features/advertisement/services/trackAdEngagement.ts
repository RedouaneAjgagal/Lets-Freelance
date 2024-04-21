import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api"

type TrackAdEngagementPayload = {
    adId: string;
}

type TrackAdEngagementResponse = {
    ad_id: string;
    track_id: string;
}

const trackAdEngagement = async (payload: TrackAdEngagementPayload) => {
    const response: AxiosResponse<Promise<TrackAdEngagementResponse>> = await patchRequest(`advertisements/performace/engagement`, {
        ad: payload.adId
    });

    const data = await response.data;
    return data;
}

export default trackAdEngagement;