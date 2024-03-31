import { AxiosResponse } from "axios";
import { deleteRequest } from "../../../services/api"

export type DeleteCampaignPayload = {
    campaignId: string;
}

type DeleteCampaignResponse = {
    msg: string;
}

const deleteCampaign = async (payload: DeleteCampaignPayload) => {
    const response: AxiosResponse<Promise<DeleteCampaignResponse>> = await deleteRequest(`advertisements/campaigns/${payload.campaignId}`);

    const data = await response.data;
    return data;
}

export default deleteCampaign;