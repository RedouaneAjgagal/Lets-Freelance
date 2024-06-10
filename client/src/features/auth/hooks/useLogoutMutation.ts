import logoutRequest from "../services/logout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../hooks/redux";
import { authAction } from "../redux/auth";

import { disconnectWebsocket } from "../../message";

const useLogoutMutation = (successMsg: string) => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            dispatch(disconnectWebsocket());

            dispatch(authAction.setUser(null));
            queryClient.removeQueries(["profileInfo"]);
            queryClient.removeQueries(["jobs"]);
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