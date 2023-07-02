import { useMutation } from "@tanstack/react-query";
import resetPasswordRequest from "../services/resetPassword";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";


const useResetPasswordMutation = () => {
    const navigate = useNavigate();
    const resetPasswordMutation = useMutation({
        mutationFn: resetPasswordRequest,
        onSuccess: ({ data }) => {
            toast.success(data.msg, { duration: 4000 });
            navigate("/auth/login");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong!";
            toast.error(errorMsg)
        }
    });
    return resetPasswordMutation;
}

export default useResetPasswordMutation;