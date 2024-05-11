import { useQuery } from '@tanstack/react-query';
import employersAnalytics from '../services/employersAnalytics';

const useEmployersAnalyticsQuery = () => {
    const employersAnalyticsQuery = useQuery({
        queryKey: ["employersAnalytics"],
        queryFn: employersAnalytics,
        retry: false,
        refetchOnWindowFocus: false
    });

    return employersAnalyticsQuery;
}

export default useEmployersAnalyticsQuery