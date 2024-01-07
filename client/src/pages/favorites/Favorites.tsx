import Loading from "../../components/Loading";
import { useFavoritesQuery, FavoritesContainer } from "../../features/favorites";

const Favorites = () => {
    const favorites = useFavoritesQuery();

    return (
        <main className="p-4 bg-purple-100/30 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Favorites</h1>
            {
                favorites.isLoading ?
                    <Loading />
                    :
                    <FavoritesContainer />
            }
        </main>
    )
}

export default Favorites