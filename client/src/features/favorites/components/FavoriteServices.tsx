import { FavoriteService } from "../services/getFavorites";
import FavouriteService from "./FavouriteService";

type FavoriteServicesType = {
    services: FavoriteService[];
}

const FavoriteServices = (props: React.PropsWithoutRef<FavoriteServicesType>) => {
    return (
        <ul className="flex flex-col gap-6">
            {props.services.length ?
                props.services.map(service => <FavouriteService key={service._id} serviceDetails={service} favorite={{ isFavorite: true }} />)
                :
                <h2>You don't have any favorite services</h2>
            }
        </ul>
    )
}

export default FavoriteServices