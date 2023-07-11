import { useMutation } from "@tanstack/react-query";
import loginRequest from "../services/login";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import useCurrentUserMutation from "./useCurrentUserMutation";

const useLoginMutation = () => {
    const navigate = useNavigate();
    const currentUserMutation = useCurrentUserMutation();
    const loginMutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: ({ data }) => {
            toast.success(data.msg);
            currentUserMutation.mutate();
            navigate("/");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong!";
            toast.error(errorMsg);
        }
    });
    return loginMutation;
}

export default useLoginMutation;