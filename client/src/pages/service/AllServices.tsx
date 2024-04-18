import { useEffect } from "react";
import Loading from "../../components/Loading";
import { ServicesContainer, useSearchServicesQuery } from "../../features/service"
import { useAppSelector } from "../../hooks/redux";
import { useDispatch } from "react-redux";
import { filterSearchedServicesAction } from "../../features/service/redux/filterSearchedServices";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

const AllServices = () => {
    const [URLSearchParams] = useSearchParams();

    const dispatch = useDispatch();
    const filterSearchedServices = useAppSelector(state => state.filterSearchedServicesReducer);

    const queryClient = useQueryClient();

    let hasActivated = false;

    // clear all filters & search when first time loading the page
    useEffect(() => {
        const isNavSearch = URLSearchParams.get("nav_search") === "true";

        queryClient.removeQueries({ queryKey: ["searchServices"] }); // remove cache if already has been chached to re-loading the component

        dispatch(filterSearchedServicesAction.clearAll({ keepSearch: isNavSearch })); // remove all filters if existed

        hasActivated = true;
    }, []);


    const searchedServicesQuery = useSearchServicesQuery(filterSearchedServices);

    useEffect(() => {
        // don't refetch on the first load
        if (!hasActivated) {
            searchedServicesQuery.refetch();
        }
    }, [filterSearchedServices]);

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