import { useQuery } from "@tanstack/react-query";
import advertisementRevenueAnalytics, { AdvertisementRevenueAnalyticsPaylod } from "../services/advertisementRevenueAnalytics";


const useAdvertisementRevenueAnalyticsQuery = (payload: AdvertisementRevenueAnalyticsPaylod) => {
    const advertisementRevenueAnalyticsQuery = useQuery({
        queryKey: ["advertisementRevenueAnalytics"],
        queryFn: () => advertisementRevenueAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return advertisementRevenueAnalyticsQuery;
}

export default useAdvertisementRevenueAnalyticsQuery