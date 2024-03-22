import { useMutation, useQueryClient } from '@tanstack/react-query';
import setBankAccount from '../services/setBankAccount';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../../hooks/redux';
import { AxiosError } from 'axios';

const useSetBankAccountMutation = () => {
    const queryClient = useQueryClient();
    const { userInfo } = useAppSelector(state => state.authReducer);

    const setBankAccountMutation = useMutation({
        mutationFn: setBankAccount,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_setBankAccount",
                duration: 3000
            });

            queryClient.invalidateQueries({ queryKey: ["bankAccounts", userInfo!.profileId] });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_setBankAccount",
                duration: 5000
            });
        }
    });

    return setBankAccountMutation;
}

export default useSetBankAccountMutation