import { useQuery } from "@tanstack/react-query";
import campaignAnalytics, { CampaignAnalyticsPayload } from "../services/campaignAnalytics";


const useCampaignAnalyticsQuery = (payload: CampaignAnalyticsPayload) => {
    const campaignAnalyticsQuery = useQuery({
        queryKey: ["campaignAnalytics"],
        queryFn: () => campaignAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return campaignAnalyticsQuery;
}

export default useCampaignAnalyticsQuery