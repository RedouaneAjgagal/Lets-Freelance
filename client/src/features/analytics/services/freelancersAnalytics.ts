import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api"

type FreelancersAnalyticsBadgeType = {
    _id: "none" | "rising talent" | "top rated" | "top rated plus";
    count: number;
    percentage: number;
};

type FreelancersAnalyticsSpendOnConnectsType = {
    _id: null;
    count: number;
    percentage: number;
};

type FreelancersAnalyticsResponse = {
    totalFreelancers: number;
    badges: FreelancersAnalyticsBadgeType[];
    spendOnConnects: FreelancersAnalyticsSpendOnConnectsType;
};

const freelancersAnalytics = async () => {
    const response: AxiosResponse<Promise<FreelancersAnalyticsResponse>> = await getRequest(`profiles/analysis/freelancers`);

    const data = await response.data;
    return data;
};

export default freelancersAnalytics;