import ServiceCard from "../../../components/ServiceCard";
import { SearchServiceType } from "../services/searchServices"

type SearchedServicesProps = {
    services: SearchServiceType[];
}

const SearchedServices = (props: React.PropsWithoutRef<SearchedServicesProps>) => {

    return (
        <ul className="flex flex-col gap-6">
            {props.services.map(service => <ServiceCard key={service._id} serviceDetails={{
                service,
                serviceBy: service.profile
            }} hideFavorite />)}
        </ul>
    )
}

export default SearchedServices