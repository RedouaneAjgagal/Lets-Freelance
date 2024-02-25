import { useMutation, useQueryClient } from '@tanstack/react-query'
import deleteJob from '../service/deleteJob'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useAppSelector } from '../../../hooks/redux'

const useDeleteJobMutation = () => {
    const queryClient = useQueryClient();

    const { userInfo } = useAppSelector(state => state.authReducer);

    const deleteJobMutation = useMutation({
        mutationFn: deleteJob,
        retry: 0,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["employerJobs", userInfo!.profileId] });
            queryClient.invalidateQueries({ queryKey: ["jobs"] });

            toast.success(data.msg, {
                id: "success_deleteJob",
                duration: 3000
            });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            toast.error(error.response?.data.msg || "Something went wrong", {
                id: "error_deleteJob",
                duration: 5000
            });
        }
    })

    return deleteJobMutation;
}

export default useDeleteJobMutation