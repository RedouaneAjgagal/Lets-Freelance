import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api";

export type UpdateAdPayload = {
    adId: string;
    adDetails: {
        service: string;
        bidAmount: number;
        event: "cpc" | "cpm";
        category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
        keywords: string[];
    }
}

export type UpdateAdResponse = Partial<UpdateAdPayload["adDetails"]>;

const updateAd = async (payload: UpdateAdPayload) => {
    const response: AxiosResponse<Promise<UpdateAdResponse>> = await patchRequest(`advertisements/ads/${payload.adId}`, payload.adDetails);

    const data = await response.data;
    return data;
}

export default updateAd;