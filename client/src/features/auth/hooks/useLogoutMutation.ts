import logoutRequest from "../services/logout";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../hooks/redux";
import { authAction } from "../redux/auth";

const useLogoutMutation = (successMsg: string) => {
    const dispatch = useAppDispatch();
    const logoutMutation = useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            dispatch(authAction.setUser(null));
            toast.success(successMsg);
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg);
        }
    });
    return logoutMutation;
}

export default useLogoutMutation;