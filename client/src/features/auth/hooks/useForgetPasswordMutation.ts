import { useMutation } from "@tanstack/react-query";
import forgetPasswordRequest from "../services/forgetPassword";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const useForgetPasswordMutation = () => {
    const forgetPasswordMutation = useMutation({
        mutationFn: forgetPasswordRequest,
        onSuccess: () => {
            toast.success("Success");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong!";
            toast.error(errorMsg);
        }
    });
    return forgetPasswordMutation;
}

export default useForgetPasswordMutation;