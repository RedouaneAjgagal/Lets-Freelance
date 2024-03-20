import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteBankAccount from '../services/deleteBankAccount';
import { useAppSelector } from '../../../hooks/redux';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const useDeleteBankAccountMutation = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const deleteBankAccountMutation = useMutation({
        mutationFn: deleteBankAccount,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                duration: 3000,
                id: "success_deleteBankAccount"
            });

            queryClient.setQueryData(["bankAccounts", userInfo!.profileId], () => {
                return {
                    bankAccounts: []
                };
            });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                duration: 5000,
                id: "error_deleteBankAccount"
            });
        }
    });
    return deleteBankAccountMutation;
}

export default useDeleteBankAccountMutation