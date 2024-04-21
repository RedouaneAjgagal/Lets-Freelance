import { useMutation } from '@tanstack/react-query'
import orderService from '../services/orderService'
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const useOrderServiceMutation = () => {
    const orderServiceMutation = useMutation({
        mutationFn: orderService,
        onSuccess: (data) => {
            window.open(data.url, "_bank", "noopener noreferrer");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            toast.error(error.response?.data.msg || "Something went wrong!", { id: "orderService" });
        }
    });

    return orderServiceMutation;
}

export default useOrderServiceMutation