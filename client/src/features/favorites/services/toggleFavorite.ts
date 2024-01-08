import { postRequest } from "../../../services/api"

type ToggleFavoritePayloadType = {
    event: "profile" | "service" | "job";
    target: string;
};

type ToggleFavoriteType = {
    msg: string;
    status: "add" | "remove";
}

const toggleFavorite = async ({ event, target }: ToggleFavoritePayloadType) => {
    const response = await postRequest("favourites", {
        event,
        target
    });

    const favorite = await response.data as ToggleFavoriteType;
    return favorite;
}

export default toggleFavorite;