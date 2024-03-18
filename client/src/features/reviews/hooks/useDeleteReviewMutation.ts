import { useMutation, useQueryClient } from '@tanstack/react-query'
import deleteReview from '../services/deleteReview'
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../hooks/redux';
import { AxiosError } from 'axios';

type useDeleteReviewMutationPayload = {
    contractId: string;
}

const useDeleteReviewMutation = (payload: useDeleteReviewMutationPayload) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const deleteReviewMutation = useMutation({
        mutationFn: deleteReview,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_deleteReview",
                duration: 3000
            });

            queryClient.invalidateQueries({ queryKey: ["singleContract", payload.contractId, userInfo!.profileId] });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_deleteReview",
                duration: 5000
            });
        }
    });

    return deleteReviewMutation
}

export default useDeleteReviewMutation