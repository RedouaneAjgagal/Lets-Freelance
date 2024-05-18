import { useQuery } from '@tanstack/react-query';
import contractAnalytics, { ContractAnalyticsPayload } from '../services/contractAnalytics';

const useContractAnalyticsQuery = (payload: ContractAnalyticsPayload) => {
    const contractAnalyticsQuery = useQuery({
        queryKey: ["contractAnalytics"],
        queryFn: () => contractAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return contractAnalyticsQuery;
}

export default useContractAnalyticsQuery