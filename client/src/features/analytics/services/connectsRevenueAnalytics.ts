import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type ConnectsRevenueAnalyticsPayload = {
    payment_duration?: "day" | "week" | "month" | "year";
};

export type connectsRevenueAnalyticsPaymentType = {
    _id: string;
    paymentsCount: number;
    connectionsCount: number;
    netRevenue: number;
};

export type ConnectsRevenueAnalyticsResponse = connectsRevenueAnalyticsPaymentType[];

const connectsRevenueAnalytics = async (payload: ConnectsRevenueAnalyticsPayload) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<ConnectsRevenueAnalyticsResponse>> = await getRequest(`statements/connects${formatQueries}`);

    const data = await response.data;
    return data;
};

export default connectsRevenueAnalytics