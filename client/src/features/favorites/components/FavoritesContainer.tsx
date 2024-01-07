import { useState } from "react";
import FavoriteButton from "./FavoriteButton";
import FavoriteEmployers from "./FavoriteEmployers";
import FavoriteFreelancers from "./FavoriteFreelancers";
import FavoriteJobs from "./FavoriteJobs";
import FavoriteServices from "./FavoriteServices";

const FavoritesContainer = () => {
    const [favouriteType, setFavouriteType] = useState<"Services" | "Jobs" | "Freelancers" | "Employers">("Services");

    const favourites = ["Services", "Jobs", "Freelancers", "Employers"] as const;

    const favoriteNavigator = (favorite: "Services" | "Jobs" | "Freelancers" | "Employers") => {
        setFavouriteType(favorite);
    }

    const favoriteElems = {
        "Services": FavoriteServices,
        "Jobs": FavoriteJobs,
        "Freelancers": FavoriteFreelancers,
        "Employers": FavoriteEmployers
    }

    const FavoriteElem = favoriteElems[favouriteType];

    return (
        <section className="p-4 bg-white rounded shadow-sm">
            <div className="flex items-center gap-6 flex-wrap border-b pb-3 gap-y-3 mb-6">
                {favourites.map((favourite, index) => <FavoriteButton key={index} value={favourite} isActive={favourite === favouriteType} onClick={favoriteNavigator} />)}
            </div>
            <FavoriteElem />
        </section>
    )
}

export default FavoritesContainer