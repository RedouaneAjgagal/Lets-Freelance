import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../../../hooks/redux';
import getCampaigns from '../services/getCampaigns';

const useGetCampaignsQuery = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const getCampaignsQuery = useQuery({
        queryKey: ["campaigns", userInfo!.profileId],
        queryFn: getCampaigns,
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true
    });

    return getCampaignsQuery;
}

export default useGetCampaignsQuery