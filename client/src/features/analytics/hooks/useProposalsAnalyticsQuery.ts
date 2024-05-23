import { useQuery } from '@tanstack/react-query';
import proposalsAnalytics, { ProposalsAnalyticsPayload } from '../services/proposalsAnalytics';

const useProposalsAnalyticsQuery = (payload: ProposalsAnalyticsPayload) => {
    const proposalsAnalyticsQuery = useQuery({
        queryKey: ["proposalsAnalytics"],
        queryFn: () => proposalsAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return proposalsAnalyticsQuery;
}

export default useProposalsAnalyticsQuery