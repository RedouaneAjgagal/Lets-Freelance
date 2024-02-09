import { useEffect } from "react";
import Loading from "../../components/Loading";
import { ServicesContainer, useSearchServicesQuery } from "../../features/service"
import { useAppSelector } from "../../hooks/redux";

const AllServices = () => {
    const filterSearchedServices = useAppSelector(state => state.filterSearchedServicesReducer);

    const searchedServicesQuery = useSearchServicesQuery(filterSearchedServices);

    useEffect(() => {
        searchedServicesQuery.refetch();
    }, [filterSearchedServices]);

    console.log(searchedServicesQuery.hasNextPage);


    return (
        <main className="p-4 flex flex-col gap-6">
            {
                searchedServicesQuery.isLoading ?
                    <Loading />
                    :
                    <ServicesContainer pages={searchedServicesQuery.data!.pages} onLoadMore={searchedServicesQuery.fetchNextPage} isFetchingNextPage={searchedServicesQuery.isFetchingNextPage} hasNextPage={searchedServicesQuery.hasNextPage} />
            }
        </main>
    )
}

export default AllServices