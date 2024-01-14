import { FavoriteServiceType } from "../services/getFavorites";
import FavoriteService from "./FavoriteService";

type FavoriteServicesType = {
    services: FavoriteServiceType[];
}

const FavoriteServices = (props: React.PropsWithoutRef<FavoriteServicesType>) => {
    return (
        <ul className="flex flex-col gap-6 p-4">
            {props.services.length ?
                props.services.map(service => <FavoriteService key={service._id} serviceDetails={service} favorite={{ isFavorite: true }} />)
                :
                <h2>You don't have any favorite services</h2>
            }
        </ul>
    )
}

export default FavoriteServices