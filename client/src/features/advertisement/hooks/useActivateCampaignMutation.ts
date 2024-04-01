import { useMutation, useQueryClient } from '@tanstack/react-query';
import activateCampaign from '../services/activateCampaign';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../hooks/redux';

type ActivateCampaignMutationPayload = {
    campaignId: string;
}

const useActivateCampaignMutation = (payload: ActivateCampaignMutationPayload) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const activateCampaignMutation = useMutation({
        mutationFn: activateCampaign,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["singleCampaign", payload.campaignId, userInfo!.profileId] });
            queryClient.refetchQueries({ queryKey: ["campaigns", userInfo!.profileId] });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_activateCampaign",
                duration: 5000
            });
        }
    })

    return activateCampaignMutation;
}

export default useActivateCampaignMutation