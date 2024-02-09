import { useQueryClient } from "@tanstack/react-query";
import { SearchServicesType } from "../services/searchServices"
import SearchServicesHeader from "./SearchServicesHeader"
import SearchedServices from "./SearchedServices"
import Loading from "../../../components/Loading";

type ServicesContainerProps = {
    searchedServices: SearchServicesType;
}

const ServicesContainer = (props: React.PropsWithoutRef<ServicesContainerProps>) => {

    const queryClient = useQueryClient();
    const isFetching = queryClient.isFetching({ queryKey: ["searchServices"] });

    return (
        <div>
            <SearchServicesHeader />
            {
                isFetching ?
                    <Loading />
                    :
                    props.searchedServices.services.length ?
                        <SearchedServices services={props.searchedServices.services} />
                        :
                        <h3 className="text-slate-700">Empty..</h3>
            }
        </div>
    )
}

export default ServicesContainer