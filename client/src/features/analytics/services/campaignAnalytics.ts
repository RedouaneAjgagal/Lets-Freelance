import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type CampaignAnalyticsPayload = {
    created_campaign_duration?: "day" | "week" | "month" | "year";
};

export type CampaignAnalyticsValue<T extends string> = {
    _id: T;
    count: number;
    percentage: number;
};

export type CampaignAnalyticsResponse = {
    totalCampaigns: number;
    totalDurationCampaigns: number;
    totalActiveCampaigns: number;
    totalDailyBudgetCampaigns: number;
    totalTotalBudgetCampaigns: number;
    durationCampaigns: CampaignAnalyticsValue<string>[];
    statusCampaigns: CampaignAnalyticsValue<"active" | "inactive">[];
    activeCampaignsRange: CampaignAnalyticsValue<"inTodayRange" | "notInTodayRange">[];
    campaignTypes: CampaignAnalyticsValue<"daily" | "total">[];
    dailyBudgetCampaigns: CampaignAnalyticsValue<"low" | "mid" | "high">[];
    totalBudgetCampaigns: CampaignAnalyticsValue<"low" | "mid" | "high">[];
    containAds: CampaignAnalyticsValue<"one" | "three_and_less" | "nine_and_less" | "ten">[];
};

const campaignAnalytics = async (payload: CampaignAnalyticsPayload) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<CampaignAnalyticsResponse>> = await getRequest(`advertisements/campaigns/analysis/campaign${formatQueries}`);

    const data = await response.data;
    return data;
};

export default campaignAnalytics;