import { useAppSelector } from "../../../hooks/redux";
import { FavoritesType } from "../services/getFavorites";
import { useQueryClient } from "@tanstack/react-query";
import FavouriteService from "./FavouriteService";

const FavoriteServices = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const queryClient = useQueryClient();
    const { services } = queryClient.getQueryData(["favorites", userInfo!.profileId]) as FavoritesType;


    return (
        <ul className="flex flex-col gap-6">
            {services.length ?
                services.map(service => <FavouriteService key={service._id} serviceDetails={service} favorite={{ isFavorite: true }} />)
                :
                <h2>You don't have any favorite services</h2>
            }
        </ul>
    )
}

export default FavoriteServices