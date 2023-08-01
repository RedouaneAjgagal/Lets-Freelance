import swtichProfile from "../services/switchProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import Toaster from "react-hot-toast";

const useSwitchProfileMutation = () => {
    const queryClient = useQueryClient();
    const switchProfileMutation = useMutation({
        mutationKey: ["switchProfile"],
        mutationFn: swtichProfile,
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: ["profileInfo"] });
            Toaster.success(data.msg, { id: "switchProfile" });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            Toaster.error(errorMsg, { id: "switchProfile" });
        }
    });
    return switchProfileMutation;
}

export default useSwitchProfileMutation