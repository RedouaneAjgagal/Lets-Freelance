import { useQuery } from '@tanstack/react-query';
import freelancersAnalytics from '../services/freelancersAnalytics';

const useFreelancersAnalyticsQuery = () => {
    const freelancersAnalyticsQuery = useQuery({
        queryKey: ["freelancersAnalytics"],
        queryFn: freelancersAnalytics,
        retry: false,
        refetchOnWindowFocus: false
    });

    return freelancersAnalyticsQuery;
}

export default useFreelancersAnalyticsQuery