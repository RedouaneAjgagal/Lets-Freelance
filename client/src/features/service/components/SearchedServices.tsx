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
        <ul className="grid grid-cols-1 gap-6 min-[620px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {searchedServices}
        </ul>
    )
}

export default SearchedServices