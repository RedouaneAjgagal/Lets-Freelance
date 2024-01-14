import getFavorites from "../services/getFavorites";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../../hooks/redux";

const useFavoritesQuery = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const favoritesQuery = useQuery({
        queryKey: ["favorites", userInfo!.profileId],
        queryFn: getFavorites,
        retry: false,
        refetchOnWindowFocus: false
    });

    return favoritesQuery;
}

export default useFavoritesQuery;