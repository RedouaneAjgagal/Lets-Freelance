import { useQuery } from '@tanstack/react-query';
import jobsAnalytics, { JobsAnalyticsPayload } from '../services/jobsAnalytics';

const useJobAnalyticsQuery = (payload: JobsAnalyticsPayload) => {
    const jobAnalyticsQuery = useQuery({
        queryKey: ["jobAnalytics"],
        queryFn: () => jobsAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return jobAnalyticsQuery;
}

export default useJobAnalyticsQuery