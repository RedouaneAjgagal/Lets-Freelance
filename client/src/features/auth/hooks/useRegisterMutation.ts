import { useMutation } from "@tanstack/react-query";
import registerRequest from "../services/register";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const useRegisterMutation = () => {
    const navigate = useNavigate();
    const registerMutation = useMutation({
        mutationFn: registerRequest,
        onSuccess: ({ data }) => {
            toast.success(data.msg, { duration: 4000 });
            navigate("/auth/login");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong!";
            toast.error(errorMsg);
        }
    });
    return registerMutation;
}

export default useRegisterMutation;