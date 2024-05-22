import { AxiosResponse } from "axios";
import formatSearchQueries from "../../../utils/formatSearchQueries";
import { getRequest } from "../../../services/api";

export type HourlyJobRevenueAnalyticsPayload = {
    payment_duration?: "day" | "week" | "month" | "year";
};

export type HourlyJobRevenueAnalyticsPaymentType = {
    _id: string;
    count: number;
    grossRevenue: number;
    netRevenue: number;
};

export type HourlyJobRevenueAnalyticsResponse = {
    paidPayments: HourlyJobRevenueAnalyticsPaymentType[];
    refundedPayments: HourlyJobRevenueAnalyticsPaymentType[];
};

const hourlyJobRevenueAnalytics = async (payload: HourlyJobRevenueAnalyticsPayload) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<HourlyJobRevenueAnalyticsResponse>> = await getRequest(`statements/jobs/hourly${formatQueries}`);

    const data = await response.data;
    return data;
};

export default hourlyJobRevenueAnalytics;