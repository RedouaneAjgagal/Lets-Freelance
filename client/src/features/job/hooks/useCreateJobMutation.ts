import { useMutation, useQueryClient } from '@tanstack/react-query';
import createJob from '../service/createJob';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../hooks/redux';

const useCreateJobMutation = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const createJobMutation = useMutation({
        mutationFn: createJob,
        retry: false,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["employerJobs", userInfo!.profileId] });
            queryClient.invalidateQueries({ queryKey: ["jobs"] });

            toast.success(data.msg, {
                id: "success_createJob",
                duration: 3000
            });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            toast.error(error.response?.data.msg || "Something went wrong", {
                id: "error_createJob",
                duration: 5000
            });
        }
    });

    return createJobMutation;
}

export default useCreateJobMutation;