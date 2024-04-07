import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateCampaign from '../services/updateCampaign';
import { AxiosError } from 'axios';
import { useAppSelector } from '../../../hooks/redux';
import toast from 'react-hot-toast';

type UseUpdateCampaignMutationPayload = {
    campaignId: string;
    onSuccess?: () => void;
}

const useUpdateCampaignMutation = (payload: UseUpdateCampaignMutationPayload) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const updateCampaignMutation = useMutation({
        mutationFn: updateCampaign,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_updateCampaign",
                duration: 3000
            });

            queryClient.invalidateQueries({ queryKey: ["singleCampaign", payload.campaignId, userInfo!.profileId] });

            if (payload.onSuccess) {
                payload.onSuccess();
            }
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_updateCampaign",
                duration: 5000
            });
        }
    })

    return updateCampaignMutation;
}

export default useUpdateCampaignMutation