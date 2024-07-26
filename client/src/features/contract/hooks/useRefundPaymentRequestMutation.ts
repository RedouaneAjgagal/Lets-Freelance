import { useMutation, useQueryClient } from '@tanstack/react-query';
import refundPaymentRequest from '../services/refundPaymentRequest';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const useRefundPaymentRequestMutation = () => {
    const queryClient = useQueryClient();

    const refundPaymentRequestMutation = useMutation({
        mutationFn: refundPaymentRequest,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_refundPaymentRequest",
                duration: 3000
            });

            queryClient.invalidateQueries({ queryKey: ["refundRequests"] });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_refundPaymentRequest",
                duration: 5000
            });
        }
    })

    return refundPaymentRequestMutation;
}

export default useRefundPaymentRequestMutation