import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api"

export type SingleCampaignType = {
    _id: string;
    status: "active" | "inactive";
    name: string;
    budget: number;
    budgetType: "total" | "daily";
    startDate: string;
    endDate: string;
    createdAt: string;
    totalAds: number;
    clicks: number;
    impressions: number;
    orders: number;
    ctr: number;
    cr: number;
    cpc: number;
    spend: number;
    activeAds: number;
}

export type GetCampaignsResponse = SingleCampaignType[];

const getCampaigns = async () => {
    const response: AxiosResponse<Promise<GetCampaignsResponse>> = await getRequest("advertisements/campaigns");

    const data = await response.data;
    return data;
}

export default getCampaigns;