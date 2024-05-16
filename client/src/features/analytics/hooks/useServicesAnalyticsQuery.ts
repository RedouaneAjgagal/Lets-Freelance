import { useQuery } from '@tanstack/react-query';
import servicesAnalytics, { ServicesAnalyticsPayload } from '../services/servicesAnalytics';

const useServicesAnalyticsQuery = (payload: ServicesAnalyticsPayload) => {
    const servicesAnalyticsQuery = useQuery({
        queryKey: ["servicesAnalytics"],
        queryFn: () => servicesAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return servicesAnalyticsQuery;
}

export default useServicesAnalyticsQuery