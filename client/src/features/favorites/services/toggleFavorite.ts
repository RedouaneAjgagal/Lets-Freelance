import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api"

export type ToggleFavoritePayloadType = {
    event: "profile" | "service" | "job";
    target: string;
};

type ToggleFavoriteType = {
    msg: string;
    status: "add" | "remove";
}

const toggleFavorite = async ({ event, target }: ToggleFavoritePayloadType) => {
    const response: AxiosResponse<Promise<ToggleFavoriteType>> = await postRequest("favourites", {
        event,
        target
    });

    const favorite = await response.data;
    return favorite;
}

export default toggleFavorite;