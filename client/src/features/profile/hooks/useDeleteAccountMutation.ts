import { useMutation } from "@tanstack/react-query";
import deleteAccount from "../services/deleteAccount";
import Toaster from "react-hot-toast";
import { AxiosError } from "axios";
import { useLogoutMutation } from "../../auth";
import { useNavigate } from "react-router-dom";

const useDeleteAccountMutation = () => {
    const navigate = useNavigate();
    const logoutMutation = useLogoutMutation("Account deleted");
    const deleteAccountMutation = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            logoutMutation.mutate();
            navigate("/");
            document.body.style.overflow = "auto";
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            Toaster.error(errorMsg, { id: "deleteAccount" });
        }
    });
    return deleteAccountMutation;
}

export default useDeleteAccountMutation;