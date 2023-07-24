import { useMutation } from "@tanstack/react-query"
import changeEmailRequest from "../services/changeEmailRequest"
import Toaster from "react-hot-toast"
import { AxiosError } from "axios"

const useChangeEmailRequestMutation = () => {
    const changeEmailRequestMutation = useMutation({
        mutationFn: changeEmailRequest,
        onSuccess: (data) => {
            Toaster.success(data.msg, { id: "changeEmailRequest", duration: 4000 });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            Toaster.error(errorMsg, { id: "changeEmailRequest" });
        }
    });
    return changeEmailRequestMutation;
}

export default useChangeEmailRequestMutation