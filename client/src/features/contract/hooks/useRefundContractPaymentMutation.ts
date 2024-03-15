import { useMutation } from '@tanstack/react-query';
import refundContractPayment from '../services/refundContractPayment';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const useRefundContractPaymentMutation = () => {
    const refundContractPaymentMutation = useMutation({
        mutationFn: refundContractPayment,
        retry: false,
        onSuccess: () => {
            window.scrollTo({
                top: 0,
                behavior: "instant"
            });
        },
        onError: (error: AxiosError<{ msg: string; }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_cancelContract",
                duration: 5000
            });
        }
    });

    return refundContractPaymentMutation;
}

export default useRefundContractPaymentMutation