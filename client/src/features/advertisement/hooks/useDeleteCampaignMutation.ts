import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteCampaign from '../services/deleteCampaign';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../hooks/redux';
import { useNavigate } from 'react-router-dom';

const useDeleteCampaignMutation = () => {
    const navigate = useNavigate();
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const deleteCampaignMutation = useMutation({
        mutationFn: deleteCampaign,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_deleteCampaign",
                duration: 3000
            });

            navigate("/profile/freelancer/advertisements/campaigns");

            queryClient.invalidateQueries({ queryKey: ["campaigns", userInfo!.profileId] });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_deleteCampaign",
                duration: 5000
            });
        }
    });

    return deleteCampaignMutation;
}

export default useDeleteCampaignMutation