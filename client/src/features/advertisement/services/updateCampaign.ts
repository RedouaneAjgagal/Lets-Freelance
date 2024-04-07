import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api";

export type UpdateCampaignPayload = {
    campaignId: string;
    campaignDetails: {
        name: string;
        budgetType: "total" | "daily";
        budget: number;
        endDate: string;
    };
}

export type UpdateCampaignResponse = {
    msg: string;
}

const updateCampaign = async (payload: UpdateCampaignPayload) => {
    console.log(payload.campaignDetails);

    const response: AxiosResponse<Promise<UpdateCampaignResponse>> = await patchRequest(`advertisements/campaigns/${payload.campaignId}`, payload.campaignDetails);

    const data = await response.data;
    return data;
}

export default updateCampaign;