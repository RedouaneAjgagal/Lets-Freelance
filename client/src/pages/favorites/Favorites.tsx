import { useFavoritesQuery } from "../../features/favorites";

const Favorites = () => {

    const favorites = useFavoritesQuery();

    console.log(favorites.data);

    return (
        <div>Favorites</div>
    )
}

export default Favorites