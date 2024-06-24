import { useMutation } from '@tanstack/react-query';
import setInitialMessage from '../services/setInitialMessage';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';


const useSetInitialMessageMutation = () => {
    const setInitialMessageMutation = useMutation({
        mutationFn: setInitialMessage,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_setInitialMessage",
                duration: 3000
            });

            window.open("/profile/messages", "noopener noreferrer");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_setInitialMessage",
                duration: 5000
            });
        }
    })

    return setInitialMessageMutation;
}

export default useSetInitialMessageMutation