import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api"

type AdSetType = {
    service: string;
    bidAmount: number;
    event: "cpc" | "cpm";
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    keywords: string[];
}

export type CreateCampaignPayload = {
    name: string;
    budget: number;
    budgetType: "daily" | "total";
    startDate: string;
    endDate: string;
    ads: AdSetType[];
}

type CreateCampaignResponse = {
    msg: string;
}

const createCampaign = async (payload: CreateCampaignPayload) => {
    const response: AxiosResponse<Promise<CreateCampaignResponse>> = await postRequest(`advertisements/campaigns`, payload);

    const data = await response.data;
    return data;
}

export default createCampaign;