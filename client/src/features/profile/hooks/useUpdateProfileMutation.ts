import { useMutation } from "@tanstack/react-query";
import updateProfile from "../services/updateProfile";
import Toaster from "react-hot-toast";
import { AxiosError } from "axios";

const useUpdateProfileMutation = () => {
    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            Toaster.success(data.data.msg);
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            Toaster.error(errorMsg);
        }
    });
    return updateProfileMutation;
}

export default useUpdateProfileMutation