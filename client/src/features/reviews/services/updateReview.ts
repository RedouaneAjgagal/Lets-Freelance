import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api";

export type UpdateReviewPayload = {
    reviewId: string;
    rating: number;
    description?: string;
}

export type UpdateReviewResponse = {
    rating: number;
    description: string;
}

const updateReview = async (payload: UpdateReviewPayload) => {

    const updateReview: { rating: number; description?: string } = {
        rating: payload.rating,
        description: payload.description
    }

    // if (payload.description) {
    //     updateReview.description = payload.description
    // }

    const response: AxiosResponse<Promise<UpdateReviewResponse>> = await patchRequest(`reviews/${payload.reviewId}`, updateReview);

    const data = await response.data;
    return data;
}

export default updateReview;