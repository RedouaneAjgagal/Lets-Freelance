import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateReview from '../services/updateReview';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useAppSelector } from '../../../hooks/redux';
import { GetUserContractsReponse } from '../../contract';

type UseUpdateReviewMutationPayload = {
    contractId: string;
}

const useUpdateReviewMutation = (payload: UseUpdateReviewMutationPayload) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const updateReviewMutation = useMutation({
        mutationFn: updateReview,
        retry: false,
        onSuccess: (data) => {
            queryClient.setQueryData(["singleContract", payload.contractId, userInfo!.profileId], (oldData): GetUserContractsReponse => {
                const getOldData = oldData as GetUserContractsReponse;
                return {
                    ...getOldData,
                    review: {
                        ...getOldData.review!,
                        ...data
                    }
                }
            })

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
    })

    return updateReviewMutation;
}

export default useUpdateReviewMutation