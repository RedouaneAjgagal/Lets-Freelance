import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteAd from '../services/deleteAd';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';


const useDeleteAdMutation = () => {
    const { campaignId } = useParams();
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const deleteAdMutation = useMutation({
        mutationFn: deleteAd,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_deleteAd",
                duration: 3000
            });

            queryClient.invalidateQueries(["singleCampaign", campaignId, userInfo!.profileId]);
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_deleteAd",
                duration: 5000
            });
        }
    });

    return deleteAdMutation;
}

export default useDeleteAdMutation