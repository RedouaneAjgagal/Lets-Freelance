import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateJob from '../service/updateJob';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../hooks/redux';
import { useParams } from 'react-router-dom';

const useUpdateJobMutation = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const { jobId } = useParams();

    const updateJobMutation = useMutation({
        mutationFn: updateJob,
        retry: false,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["jobs"], exact: true });
            queryClient.invalidateQueries({ queryKey: ["jobs", jobId] });
            queryClient.invalidateQueries({ queryKey: ["employerJobs", userInfo!.profileId] });

            toast.success(data.msg, {
                id: "success_updateJob",
                duration: 3000
            });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_updateJob",
                duration: 5000
            });
        }
    });
    return updateJobMutation;
}

export default useUpdateJobMutation