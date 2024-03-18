import { useMutation, useQueryClient } from '@tanstack/react-query'
import createReview from '../services/createReview';
import { AxiosError } from 'axios';
import { useAppSelector } from '../../../hooks/redux';
import toast from 'react-hot-toast';

type UseCreateReviewMutaionPayload = {
    contractId: string;
}

const useCreateReviewMutaion = (payload: UseCreateReviewMutaionPayload) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const createReviewMutaion = useMutation({
        mutationFn: createReview,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["singleContract", payload.contractId, userInfo!.profileId] });

            toast.success(`You have submitted a new review`, {
                id: "success_createReview",
                duration: 3000
            });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_createReview",
                duration: 5000
            });
        }
    });

    return createReviewMutaion
}

export default useCreateReviewMutaion