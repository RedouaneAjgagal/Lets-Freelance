import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateProfile from "../services/updateProfile";
import Toaster from "react-hot-toast";
import { AxiosError } from "axios";

const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();
    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profileInfo"] });
            queryClient.invalidateQueries({ queryKey: ["currentUserInfo"] });
            Toaster.success(data.data.msg, { id: "updateProfile" });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            Toaster.error(errorMsg, { id: "updateProfile" });
        }
    });
    return updateProfileMutation;
}

export default useUpdateProfileMutation