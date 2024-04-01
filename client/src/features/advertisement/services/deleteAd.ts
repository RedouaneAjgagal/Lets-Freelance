import { AxiosResponse } from "axios";
import { deleteRequest } from "../../../services/api";

type DeleteAdPayload = {
    adId: string;
}

type DeleteAdResponse = {
    msg: string;
}

const deleteAd = async (payload: DeleteAdPayload) => {
    const response: AxiosResponse<Promise<DeleteAdResponse>> = await deleteRequest(`advertisements/ads/${payload.adId}`);

    const data = await response.data;
    return data;
}

export default deleteAd;