import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api";

export type CreateAdPayload = {
    campaignId: string;
    adDetails: {
        service: string;
        bidAmount: number;
        event: "cpc" | "cpm";
        category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
        keywords: string[];
    }
}

export type CreateAdResponse = {
    msg: string;
}

const createAd = async (payload: CreateAdPayload) => {
    const response: AxiosResponse<Promise<CreateAdResponse>> = await postRequest(`advertisements/ads?campaign_id=${payload.campaignId}`, payload.adDetails);

    const data = await response.data;
    return data;
}

export default createAd;