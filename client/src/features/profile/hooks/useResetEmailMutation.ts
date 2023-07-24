import { useMutation } from "@tanstack/react-query"
import resetEmail from "../services/resetEmail"
import Toaster from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"

const useResetEmailMutation = () => {
    const navigate = useNavigate();
    const resetEmailMutation = useMutation({
        mutationFn: resetEmail,
        onSuccess: (data) => {
            Toaster.success(data.msg, { id: "resetEmail", duration: 5000 });
            navigate("/profile/settings");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            Toaster.error(errorMsg, { id: "resetEmail" });
        }
    });
    return resetEmailMutation;
}

export default useResetEmailMutation