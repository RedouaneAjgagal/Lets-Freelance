import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type ServiceRevenueAnalyticsPayload = {
    payment_duration?: "day" | "week" | "month" | "year";
};

export type ServiceRevenueAnalyticsPaymentType = {
    _id: string;
    count: number;
    grossRevenue: number;
    netRevenue: number;
}

export type ServiceRevenueAnalyticsResponse = {
    pendingPayments: ServiceRevenueAnalyticsPaymentType[];
    paidPayments: ServiceRevenueAnalyticsPaymentType[];
    refundedPayments: ServiceRevenueAnalyticsPaymentType[];
}

const serviceRevenueAnalytics = async (payload: ServiceRevenueAnalyticsPayload) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<ServiceRevenueAnalyticsResponse>> = await getRequest(`statements/services${formatQueries}`);

    const data = await response.data;
    return data;
};

export default serviceRevenueAnalytics;