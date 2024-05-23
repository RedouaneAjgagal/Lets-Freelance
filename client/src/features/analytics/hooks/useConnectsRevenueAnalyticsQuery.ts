import { useQuery } from "@tanstack/react-query";
import connectsRevenueAnalytics, { ConnectsRevenueAnalyticsPayload } from "../services/connectsRevenueAnalytics";


const useConnectsRevenueAnalyticsQuery = (payload: ConnectsRevenueAnalyticsPayload) => {
    const connectsRevenueAnalyticsQuery = useQuery({
        queryKey: ["connectsRevenueAnalytics"],
        queryFn: () => connectsRevenueAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return connectsRevenueAnalyticsQuery;
}

export default useConnectsRevenueAnalyticsQuery