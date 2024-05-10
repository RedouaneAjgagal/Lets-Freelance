import { useQuery } from '@tanstack/react-query';
import accountsAnalytics, { AccountsAnalyticsPayload } from '../services/accountsAnalytics';

const useAccountsAnalyticsQuery = (payload: AccountsAnalyticsPayload) => {
    const accountsAnalyticsQuery = useQuery({
        queryKey: ["accountsAnalytics"],
        queryFn: () => accountsAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return accountsAnalyticsQuery;
}

export default useAccountsAnalyticsQuery