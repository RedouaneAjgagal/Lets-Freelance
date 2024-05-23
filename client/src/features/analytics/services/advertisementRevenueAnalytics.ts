import { AxiosResponse } from "axios";
import formatSearchQueries from "../../../utils/formatSearchQueries";
import { getRequest } from "../../../services/api";

export type AdvertisementRevenueAnalyticsPaylod = {
    payment_duration?: "day" | "week" | "month" | "year";
};

export type AdvertisementRevenueAnalyticsPaymentType = {
    _id: string;
    amount: number;
};

export type AdvertisementRevenueAnalyticsResponse = {
    unpaidAmount: AdvertisementRevenueAnalyticsPaymentType[];
    paidAmount: AdvertisementRevenueAnalyticsPaymentType[];
    failedAmount: AdvertisementRevenueAnalyticsPaymentType[];
};

const advertisementRevenueAnalytics = async (payload: AdvertisementRevenueAnalyticsPaylod) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<AdvertisementRevenueAnalyticsResponse>> = await getRequest(`statements/advertisements${formatQueries}`);

    const data = await response.data;
    return data;
};

export default advertisementRevenueAnalytics;