import ServiceCard from "../../../components/ServiceCard";
import { FavoriteServiceType } from "../services/getFavorites";

type FavoriteServicesType = {
    services: FavoriteServiceType[];
}

const FavoriteServices = (props: React.PropsWithoutRef<FavoriteServicesType>) => {
    return (
        <ul className="flex flex-col gap-6 p-4">
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