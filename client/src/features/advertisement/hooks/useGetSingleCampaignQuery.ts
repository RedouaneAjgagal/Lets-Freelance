import { useQuery } from '@tanstack/react-query';
import getSingleCampaign, { GetSingleCampaignPayload } from '../services/getSingleCampaign';
import { useAppSelector } from '../../../hooks/redux';

const useGetSingleCampaignQuery = (payload: GetSingleCampaignPayload) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const getSingleCampaignQuery = useQuery({
        queryKey: ["singleCampaign", payload.campaignId, userInfo!.profileId],
        queryFn: () => getSingleCampaign({
            campaignId: payload.campaignId
        }),
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true
    });

    return getSingleCampaignQuery;
}

export default useGetSingleCampaignQuery