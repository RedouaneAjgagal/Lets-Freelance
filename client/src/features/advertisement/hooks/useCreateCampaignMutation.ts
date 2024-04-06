import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCampaign from '../services/createCampaign';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { campaignFormAction } from '../redux/campaignForm';

const useCreateCampaignMutation = () => {
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const createCampaignMutation = useMutation({
        mutationFn: createCampaign,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_createCampaign",
                duration: 3000
            });

            dispatch(campaignFormAction.resetState());

            queryClient.invalidateQueries({ queryKey: ["campaigns", userInfo!.profileId] });

            navigate("/profile/freelancer/advertisements/campaigns");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_createCampaign",
                duration: 5000
            });
        }
    });

    return createCampaignMutation;
}

export default useCreateCampaignMutation