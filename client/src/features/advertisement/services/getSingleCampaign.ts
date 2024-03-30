import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";

export type GetSingleCampaignPayload = {
    campaignId: string;
}

export type AdType = {
    ad: string;
    service: string;
    status: "active" | "inactive";
    bidAmount: number;
    keywords: string[];
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    event: "cpm" | "cpc";
    orders: number;
    displayCount: number;
    clicks: number;
    ctr: number;
    cr: number;
    cpc: number;
    spend: number;
}

export type GetSingleCampaignResponse = {
    _id: string;
    status: "active" | "inactive";
    name: string;
    ads: AdType[];
    totalClicks: number;
    totalImpressions: number;
    totalOrders: number;
    totalSpend: number;
    ctr: number;
    cr: number;
    cpc: number;
}

const getSingleCampaign = async (payload: GetSingleCampaignPayload) => {
    const response: AxiosResponse<Promise<GetSingleCampaignResponse>> = await getRequest(`advertisements/campaigns/${payload.campaignId}`);

    const data = await response.data;
    return data;
}

export default getSingleCampaign;