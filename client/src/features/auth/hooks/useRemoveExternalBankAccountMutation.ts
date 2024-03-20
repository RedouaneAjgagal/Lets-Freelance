import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteExternalBankAccount from '../services/deleteExternalBankAccount';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../hooks/redux';
import { AxiosError } from 'axios';

const useRemoveExternalBankAccountMutation = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const removeExternalBankAccountMutation = useMutation({
        mutationFn: deleteExternalBankAccount,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                duration: 3000,
                id: "success_removeExternalBankAccount"
            });

            queryClient.invalidateQueries({ queryKey: ["bankAccounts", userInfo!.profileId] });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                duration: 5000,
                id: "error_removeExternalBankAccount"
            });
        }
    });

    return removeExternalBankAccountMutation;
}

export default useRemoveExternalBankAccountMutation