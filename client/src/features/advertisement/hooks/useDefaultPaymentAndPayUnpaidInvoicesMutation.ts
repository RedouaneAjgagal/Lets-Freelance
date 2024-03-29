import { useMutation, useQueryClient } from '@tanstack/react-query';
import setDefaultPaymentAndTryUnpaidInvoices from '../services/setDefaultPaymentAndTryUnpaidInvoices';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useAppSelector } from '../../../hooks/redux';
import { useNavigate } from 'react-router-dom';

const useDefaultPaymentAndPayUnpaidInvoicesMutation = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const defaultPaymentAndPayUnpaidInvoicesMutation = useMutation({
        mutationFn: setDefaultPaymentAndTryUnpaidInvoices,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_defaultPaymentUnpaidInvoices",
                duration: 3000
            });

            navigate("/profile/freelancer/advertisements/payment-methods");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_defaultPaymentUnpaidInvoices",
                duration: 3000
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["paymentMethods", userInfo!.profileId] })
        }
    });
    return defaultPaymentAndPayUnpaidInvoicesMutation;
}

export default useDefaultPaymentAndPayUnpaidInvoicesMutation