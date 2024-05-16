import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type ServicesAnalyticsPayload = {
    created_service_duration?: "day" | "week" | "month" | "year";
};

export type ServicesAnalyticsPostedAtType = {
    _id: string;
    count: number;
};

export type ServicesAnalyticsRatingType = {
    _id: "none" | "low" | "mid" | "high";
    count: number;
    percentage: number;
};

export type ServicesAnalyticsResponse = {
    totalServices: number;
    postedAt: ServicesAnalyticsPostedAtType[];
    ratingServices: ServicesAnalyticsRatingType[];
    totalDurationServices: number;
};

const servicesAnalytics = async (payload: ServicesAnalyticsPayload) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<ServicesAnalyticsResponse>> = await getRequest(`services/analysis/service${formatQueries}`);

    const data = await response.data;
    return data;
};

export default servicesAnalytics;