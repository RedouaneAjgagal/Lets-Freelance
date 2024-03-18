import { AxiosResponse } from "axios";
import { deleteRequest } from "../../../services/api";

type DeleteReviewPayload = {
    reviewId: string;
}

type DeleteReviewResponse = {
    msg: string;
}

const deleteReview = async (payload: DeleteReviewPayload) => {
    const response: AxiosResponse<Promise<DeleteReviewResponse>> = await deleteRequest(`reviews/${payload.reviewId}`);

    const data = await response.data;
    return data;
}

export default deleteReview;