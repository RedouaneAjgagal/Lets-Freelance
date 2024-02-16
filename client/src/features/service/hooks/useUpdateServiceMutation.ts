import { useMutation, useQueryClient } from '@tanstack/react-query'
import updateService from '../services/updateService'
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useAppSelector } from '../../../hooks/redux';
import { useParams } from 'react-router-dom';

const useUpdateServiceMutation = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();
    const { serviceId } = useParams();

    const updateServiceMutaion = useMutation({
        mutationFn: updateService,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_updateService",
                duration: 3000
            });

            queryClient.invalidateQueries({ queryKey: ["searchServices"] });
            queryClient.invalidateQueries({ queryKey: ["freelancerServices", userInfo!.profileId] });
            queryClient.invalidateQueries({ queryKey: ["services", serviceId!] });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            toast.error(error.response?.data.msg || "Something went wrong", {
                id: "error_updateService"
            });
        }
    });

    return updateServiceMutaion;
}

export default useUpdateServiceMutation