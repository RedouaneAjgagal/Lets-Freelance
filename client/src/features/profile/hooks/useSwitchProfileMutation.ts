import swtichProfile from "../services/switchProfile";
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";
import Toaster from "react-hot-toast";

const useSwitchProfileMutation = () => {
    const switchProfileMutation = useMutation({
        mutationFn: swtichProfile,
        onSuccess: ({ data }) => {
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