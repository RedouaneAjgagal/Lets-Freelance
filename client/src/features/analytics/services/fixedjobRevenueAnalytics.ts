import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type FixedjobRevenueAnalyticsPayload = {
    payment_duration?: "day" | "week" | "month" | "year";
};

export type ServiceRevenueAnalyticsPaymentType = {
    _id: string;
    count: number;
    grossRevenue: number;
    netRevenue: number;
};

export type FixedjobRevenueAnalyticsResponse = {
    pendingPayments: ServiceRevenueAnalyticsPaymentType[];
    paidPayments: ServiceRevenueAnalyticsPaymentType[];
    refundedPayments: ServiceRevenueAnalyticsPaymentType[];
};

const fixedjobRevenueAnalytics = async (payload: FixedjobRevenueAnalyticsPayload) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<FixedjobRevenueAnalyticsResponse>> = await getRequest(`statements/jobs/fixed${formatQueries}`);

    const data = await response.data;
    return data;
};

export default fixedjobRevenueAnalytics;