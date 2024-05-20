import { useQuery } from "@tanstack/react-query";
import serviceRevenueAnalytics, { ServiceRevenueAnalyticsPayload } from "../services/serviceRevenueAnalytics"


const useServiceRevenueAnalyticsQuery = (payload: ServiceRevenueAnalyticsPayload) => {
  const serviceRevenueAnalyticsQuery = useQuery({
    queryKey: ["serviceRevenueAnalytics"],
    queryFn: () => serviceRevenueAnalytics(payload),
    retry: false,
    refetchOnWindowFocus: false
  });

  return serviceRevenueAnalyticsQuery;
}

export default useServiceRevenueAnalyticsQuery