import { useMutation } from '@tanstack/react-query';
import cancelContract from '../services/cancelContract';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const useCancelContractMutation = () => {
    const cancelContractMutation = useMutation({
        mutationFn: cancelContract,
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
    })

    return cancelContractMutation;
}

export default useCancelContractMutation