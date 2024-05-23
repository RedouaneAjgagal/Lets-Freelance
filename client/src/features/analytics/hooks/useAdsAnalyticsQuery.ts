import { useQuery } from '@tanstack/react-query';
import adsAnalytics, { AdsAnalyticsPayload } from '../services/adsAnalytics';

const useAdsAnalyticsQuery = (payload: AdsAnalyticsPayload) => {
    const adsAnalyticsQuery = useQuery({
        queryKey: ["adsAnalytics"],
        queryFn: () => adsAnalytics(payload),
        retry: false,
        refetchOnWindowFocus: false
    });

    return adsAnalyticsQuery;
}

export default useAdsAnalyticsQuery