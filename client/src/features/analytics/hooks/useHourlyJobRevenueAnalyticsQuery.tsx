import { useQuery } from "@tanstack/react-query";
import hourlyJobRevenueAnalytics, { HourlyJobRevenueAnalyticsPayload } from "../services/HourlyJobRevenueAnalytics";


const useHourlyJobRevenueAnalyticsQuery = (payload: HourlyJobRevenueAnalyticsPayload) => {
    const hourlyJobRevenueAnalyticsQuery = useQuery({
        queryKey: ["hourlyJobRevenueAnalytics"],
        queryFn: () => hourlyJobRevenueAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return hourlyJobRevenueAnalyticsQuery;
}

export default useHourlyJobRevenueAnalyticsQuery