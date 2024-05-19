import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type AdsAnalyticsPayload = {
    created_ad_duration?: "day" | "week" | "month" | "year";
};

export type AdsAnalyticsCreatedAdSetType = {
    _id: string;
    count: number;
};

export type CampaignAnalyticsValue<T extends string | boolean> = {
    _id: T;
    count: number;
    percentage: number;
}

export type AdsAnalyticsIsDisplayingNowType = {
    _id: boolean;
    count: number;
};

export type AdsAnalyticsResponse = {
    totalAds: number;
    totalDurationAds: number;
    durationAds: AdsAnalyticsCreatedAdSetType[];
    statusAds: CampaignAnalyticsValue<"active" | "inactive">[];
    events: CampaignAnalyticsValue<"cpc" | "cpm">[];
    bidAmounts: CampaignAnalyticsValue<"low" | "mid" | "high">[];
    isDisplayingNow: AdsAnalyticsIsDisplayingNowType[];
    madeOrders: CampaignAnalyticsValue<true | false>[];
};

const adsAnalytics = async (payload: AdsAnalyticsPayload) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<AdsAnalyticsResponse>> = await getRequest(`advertisements/ads/analysis/ad${formatQueries}`);

    const data = await response.data;
    return data;
};

export default adsAnalytics;