import toggleFavorite, { ToggleFavoritePayloadType } from "../services/toggleFavorite"
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { useAppSelector } from "../../../hooks/redux"
import { SingleJobType } from "../../job"
import { SingleServiceType } from "../../service"
import { GetFreelancersResponse, SingleProfile } from "../../profile"

type FavoritesMutationPayload = ToggleFavoritePayloadType;

const useFavoritesMutation = (payload: FavoritesMutationPayload) => {
    const queryClient = useQueryClient();
    const { userInfo } = useAppSelector(state => state.authReducer);

    const favoritesMutation = useMutation({
        mutationFn: toggleFavorite,
        onSuccess: (data) => {
            toast.success(data.msg, {
                id: "success_setFavoriteSuccess",
                duration: 3000
            });

            queryClient.setQueryData<SingleJobType | SingleServiceType | SingleProfile>([`${payload.event}s`, payload.target], (updater) => {
                if (updater) {
                    return {
                        ...updater,
                        isFavorited: data.status === "add"
                    }
                }

                return updater;
            });

            queryClient.setQueryData<InfiniteData<GetFreelancersResponse>>(["talents"], (updater) => {
                if (!updater) return;

                const pages = updater.pages.map(page => {
                    const talent = page.talents.find(talent => talent._id === payload.target);
                    if (talent) {
                        talent.isFavourite = data.status === "add"
                            ? 1
                            : 0;
                    };

                    return page;
                });

                return {
                    ...updater,
                    pages
                };
            });

            queryClient.invalidateQueries({ queryKey: ["favorites", userInfo!.profileId] });
            
            if (payload.event === "profile") {
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