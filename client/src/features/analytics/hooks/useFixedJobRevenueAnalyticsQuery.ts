import { useQuery } from "@tanstack/react-query"
import fixedjobRevenueAnalytics, { FixedjobRevenueAnalyticsPayload } from "../services/fixedjobRevenueAnalytics";


const useFixedJobRevenueAnalyticsQuery = (payload: FixedjobRevenueAnalyticsPayload) => {
    const fixedJobRevenueAnalyticsQuery = useQuery({
        queryKey: ["fixedJobRevenueAnalytics"],
        queryFn: () => fixedjobRevenueAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return fixedJobRevenueAnalyticsQuery;
}

export default useFixedJobRevenueAnalyticsQuery