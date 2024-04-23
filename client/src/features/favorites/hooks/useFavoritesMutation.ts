import toggleFavorite from "../services/toggleFavorite"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { useAppSelector } from "../../../hooks/redux"


const useFavoritesMutation = (event: "profile" | "service" | "job") => {
    const queryClient = useQueryClient();
    const { userInfo } = useAppSelector(state => state.authReducer);

    const favoritesMutation = useMutation({
        mutationFn: toggleFavorite,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_setFavoriteSuccess",
                duration: 3000
            });
            
            queryClient.invalidateQueries({ queryKey: ["favorites", userInfo!.profileId] });
            if (event === "profile") {
                queryClient.invalidateQueries({ queryKey: ["highRatedFreelancers"] });
            }
        },
        onError: (e: AxiosError<{ msg: string }>) => {
            toast.error(e.response!.data.msg, {
                id: "error_setFavoriteError",
                duration: 5000
            });
        }
    });

    return favoritesMutation;
}

export default useFavoritesMutation