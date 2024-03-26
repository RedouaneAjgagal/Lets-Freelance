import { useMutation, useQueryClient } from '@tanstack/react-query';
import addExternalBankAccount from '../services/addExternalBankAccount';
import { useAppSelector } from '../../../hooks/redux';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

type UseAddExtertaBankAccountMutationPayload = {
    onClose?: () => void;
}

const useAddExtertaBankAccountMutation = (payload: UseAddExtertaBankAccountMutationPayload) => {
    const queryClient = useQueryClient();
    const { userInfo } = useAppSelector(state => state.authReducer);

    const addExtertaBankAccountMutation = useMutation({
        mutationFn: addExternalBankAccount,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_externalBankAccount",
                duration: 3000
            });

            queryClient.invalidateQueries({ queryKey: ["bankAccounts", userInfo!.profileId] });

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            if (payload.onClose) {
                payload.onClose();
            }
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_externalBankAccount",
                duration: 5000
            });
        }
    })

    return addExtertaBankAccountMutation;
}

export default useAddExtertaBankAccountMutation