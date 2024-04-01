import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api";

type ActivateCampaignPayload = {
    campaignId: string;
    status: "active" | "inactive";
}

type ActivateCampaignResponse = {
    msg: string;
}

const activateCampaign = async (payload: ActivateCampaignPayload) => {
    const response: AxiosResponse<Promise<ActivateCampaignResponse>> = await patchRequest(`advertisements/campaigns/${payload.campaignId}`, {
        status: payload.status
    });

    const data = await response.data;
    return data;
}

export default activateCampaign;