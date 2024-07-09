import ServiceCard from "../../../components/ServiceCard";
import { FavoriteServiceType } from "../services/getFavorites";

type FavoriteServicesType = {
    services: FavoriteServiceType[];
}

const FavoriteServices = (props: React.PropsWithoutRef<FavoriteServicesType>) => {
    return (
        <ul className="grid gap-6 grid-cols-1 p-4 md:grid-cols-2 xl:grid-cols-3">
            {props.services.length ?
                props.services.map(service => <ServiceCard key={service._id} serviceDetails={{
                    serviceBy: service.serviceBy,
                    service: {
                        ...service.service,
                        profile: service.serviceBy,
                        sponsored: false,
                    }
                }} favorite={{ isFavorite: true }} />)
                :
                <h2>You don't have any favorite services</h2>
            }
        </ul>
    )
}

export default FavoriteServices