import { useState } from "react";
import FavoriteButton from "./FavoriteButton";
import FavoriteEmployers from "./FavoriteEmployers";
import FavoriteFreelancers from "./FavoriteFreelancers";
import FavoriteJobs from "./FavoriteJobs";
import FavoriteServices from "./FavoriteServices";
import { FavoritesType } from "../services/getFavorites";

type FavoritesContainerType = {
    favorites: FavoritesType;
}

const FavoritesContainer = (props: React.PropsWithoutRef<FavoritesContainerType>) => {
    const [favouriteType, setFavouriteType] = useState<"Services" | "Jobs" | "Freelancers" | "Employers">("Services");

    const favourites = ["Services", "Jobs", "Freelancers", "Employers"] as const;

    const favoriteNavigator = (favorite: "Services" | "Jobs" | "Freelancers" | "Employers") => {
        setFavouriteType(favorite);
    }

    const favoriteElems = {
        "Services": <FavoriteServices services={props.favorites.services} />,
        "Jobs": <FavoriteJobs />,
        "Freelancers": <FavoriteFreelancers />,
        "Employers": <FavoriteEmployers />
    }

    const favoriteElem = favoriteElems[favouriteType];

    return (
        <section className="p-4 bg-white rounded shadow-sm">
            <div className="flex items-center gap-6 flex-wrap border-b pb-3 gap-y-3 mb-6">
                {favourites.map((favourite, index) => <FavoriteButton key={index} value={favourite} isActive={favourite === favouriteType} onClick={favoriteNavigator} />)}
            </div>
            {favoriteElem}
        </section>
    )
}

export default FavoritesContainer