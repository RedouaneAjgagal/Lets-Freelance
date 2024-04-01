import { useMutation, useQueryClient } from '@tanstack/react-query';
import activateAdSet from '../services/activateAdSet';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../hooks/redux';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';


const useActivateAdMutation = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const { campaignId } = useParams();

    const activateAdMutation = useMutation({
        mutationFn: activateAdSet,
        retry: false,
        onSuccess: () => {
            queryClient.refetchQueries(["singleCampaign", campaignId, userInfo!.profileId]);
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_activateAdSet",
                duration: 5000
            });
        }
    })

    return activateAdMutation;
}

export default useActivateAdMutation