import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api";

export type CreateReviewPayload = {
    contractId: string;
    rating: number;
    description?: string;
}

export type CreateReviewResponse = {
    _id: string;
    activity: "service" | "job";
    title: string;
    rating: number;
    description: string;
}

const createReview = async (payload: CreateReviewPayload) => {    
    const reviewContent: CreateReviewPayload = {
        contractId: payload.contractId,
        rating: payload.rating
    }

    if (payload.description) {
        reviewContent.description = payload.description;
    }

    const response: AxiosResponse<Promise<CreateReviewResponse>> = await postRequest(`reviews`, reviewContent);

    const data = await response.data;
    return data;
}

export default createReview;