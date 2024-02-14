import { useMutation, useQueryClient } from "@tanstack/react-query"
import createService from "../services/createService"
import toast from "react-hot-toast"
import { useAppSelector } from "../../../hooks/redux"
import { AxiosError } from "axios"

const useCreateServiceMutation = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();

    const createServiceMutation = useMutation({
        mutationFn: createService,
        retry: false,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_createService",
                duration: 3000
            });

            queryClient.invalidateQueries({ queryKey: ["searchServices"] });
            queryClient.invalidateQueries({ queryKey: ["freelancerServices", userInfo!.profileId] });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            toast.error(error.response?.data.msg || "Something went wrong", {
                id: "error_createService"
            });
        }
    });

    return createServiceMutation;
}

export default useCreateServiceMutation