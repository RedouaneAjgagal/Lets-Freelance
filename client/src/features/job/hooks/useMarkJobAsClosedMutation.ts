import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateJob from '../service/updateJob';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useAppSelector } from '../../../hooks/redux';

const useMarkJobAsClosedMutation = (payload: { jobId: string }) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const queryClient = useQueryClient();

    const markJobAsClosedMutation = useMutation({
        mutationFn: updateJob,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs", payload.jobId] });
            queryClient.invalidateQueries({ queryKey: ["employerJobs", userInfo!.profileId] });

            toast.success("Your job is now closed", {
                id: "success_markJobAsClosed",
                duration: 3000
            });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_markJobAsClosed",
                duration: 5000
            });
        }
    });
    return markJobAsClosedMutation;
}

export default useMarkJobAsClosedMutation