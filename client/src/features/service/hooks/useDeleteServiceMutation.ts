import { useMutation, useQueryClient } from '@tanstack/react-query'
import deleteService from '../services/deleteService'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios';
import { useAppSelector } from '../../../hooks/redux';

const useDeleteServiceMutation = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const deleteServiceMutation = useMutation({
        mutationFn: deleteService,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_deleteService",
                duration: 3000
            });

            queryClient.invalidateQueries({ queryKey: ["freelancerServices", userInfo!.profileId] });
            queryClient.invalidateQueries({ queryKey: ["searchServices"] });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            toast.error(error.response?.data.msg || "Something went wrong", {
                id: "error_deleteService",
                duration: 5000
            });
        },
        retry: false,
    });

    return deleteServiceMutation;
}

export default useDeleteServiceMutation