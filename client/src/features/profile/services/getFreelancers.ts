import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api"
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type GetFreelancersPayload = {
    search?: string;
    badge?: "rising-talent" | "top-rated" | "top-rated-plus";
    rating?: number;
    country?: string;
    hourly_rate?: string;
    category?: "digital-marketing" | "design-creative" | "programming-tech" | "writing-translation" | "video-animation" | "finance-accounting" | "music-audio";
    english_level?: "basic" | "conversational" | "fluent" | "native" | "professional";
    talent_type?: "agency-freelancers" | "independent-freelancers" | "single-freelancer";
    revenue?: string;
    cursor?: number;
}

export type SearchedTalentType = {
    _id: string;
    name: string;
    avatar: string;
    roles: {
        freelancer: {
            hourlyRate: number;
            englishLevel: "basic" | "conversational" | "fluent" | "native" | "professional";
            types: "agency freelancers" | "independent freelancers" | "single freelancer";
            skills: string[];
            badge: "none" | "rising talent" | "top rated" | "top rated plus";
            jobTitle?: string;
        }
    };
    rating: {
        avgRate?: number;
        numOfReviews: number;
    };
    createdAt: string;
    country?: string;
    description?: string;
    totalRevenue: number;
    isFavourite: 0 | 1;
}

export type GetFreelancersResponse = {
    talents: SearchedTalentType[];
    cursor: number | null;
};

const getFreelancers = (payload: GetFreelancersPayload) => {
    return async ({ pageParam = 1 }) => {
        payload.cursor = pageParam;
        const searchQueries = formatSearchQueries(payload);

        const response: AxiosResponse<Promise<GetFreelancersResponse>> = await getRequest(`profiles/freelancers${searchQueries}`);

        const data = await response.data;
        return data;
    }
}

export default getFreelancers;