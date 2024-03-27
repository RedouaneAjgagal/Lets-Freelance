import { useMutation, useQueryClient } from '@tanstack/react-query';
import deletePaymentMethod, { DeletePaymentMethodPayload } from '../services/deletePaymentMethod';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useAppSelector } from '../../../hooks/redux';
import { GetPaymentMethodsResponse } from '../services/getPaymentMethods';

const useDeletePaymentMethodMutation = (payload: DeletePaymentMethodPayload) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const deletePaymentMethodMutation = useMutation({
        mutationFn: deletePaymentMethod,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_deletePaymentMethod",
                duration: 3000
            });

            queryClient.setQueryData<GetPaymentMethodsResponse>(["paymentMethods", userInfo!.profileId], (paymentMethods) => {
                return paymentMethods?.filter(paymentMethod => paymentMethod.id !== payload.paymentMethodId);
            });

            queryClient.invalidateQueries({ queryKey: ["paymentMethods", userInfo!.profileId] });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_deletePaymentMethod",
                duration: 5000
            });
        }
    })

    return deletePaymentMethodMutation;
}

export default useDeletePaymentMethodMutation