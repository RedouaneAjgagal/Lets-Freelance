import ServiceCard from "../../../components/ServiceCard";
import { ServiceType } from "../services/searchServices"

type SearchedServicesProps = {
    services: ServiceType[];
}

const SearchedServices = (props: React.PropsWithoutRef<SearchedServicesProps>) => {

    const searchedServices = props.services.map(service => {
        return (
            <ServiceCard key={crypto.randomUUID()} serviceDetails={{
                service,
                serviceBy: service.profile
            }} hideFavorite />
        );
    });

    return (
        <ul className="flex flex-col gap-6">
            {searchedServices}
        </ul>
    )
}

export default SearchedServices