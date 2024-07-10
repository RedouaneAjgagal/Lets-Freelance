import { useEffect } from "react";
import Loading from "../../components/Loading";
import { SearchServicesType, ServicesContainer, useSearchServicesQuery } from "../../features/service"
import { useAppSelector } from "../../hooks/redux";
import { useDispatch } from "react-redux";
import { filterSearchedServicesAction } from "../../features/service/redux/filterSearchedServices";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import FilterServicesModal from "../../features/service/modals/FilterServicesModal";

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

            // get only page 1 whenever filter services
            queryClient.setQueryData<InfiniteData<SearchServicesType>>(["searchServices"], (data) => {
                if (!data) return;

                return {
                    pages: data.pages.slice(0, 1),
                    pageParams: data.pageParams.slice(0, 1),
                }
            });

            // refetch only page 1
            searchedServicesQuery.refetch({
                refetchPage: (_, index) => {
                    if (index === 0) {
                        return true;
                    };

                    return false;
                }
            });

            // remove AD engagement cache whenever filter services 
            const queryCache = queryClient.getMutationCache().find({ mutationKey: ["trackAdEngagement"], exact: false });
            if (queryCache) {
                queryClient.getMutationCache().remove(queryCache);

            }
        }
    }, [filterSearchedServices]);

    return (
        <main className="p-4 flex flex-col gap-6">
            {
                <div className="grid grid-cols-1 lg:grid-cols-12 xl:gap-2">
                    <div className="hidden lg:flex lg:col-span-3">
                        <FilterServicesModal isDesktopLayout />
                    </div>
                    {searchedServicesQuery.isLoading ?
                        <div className="col-span-1 lg:lg:col-span-9 lg:pl-4 xl:pl-0">
                            <Loading type="cards" display="grid" numOfCards={8} />
                        </div>
                        :
                        <div className="col-span-1 lg:lg:col-span-9 lg:pl-4 xl:pl-0">
                            <ServicesContainer pages={searchedServicesQuery.data!.pages} onLoadMore={searchedServicesQuery.fetchNextPage} isFetchingNextPage={searchedServicesQuery.isFetchingNextPage} hasNextPage={searchedServicesQuery.hasNextPage} />
                        </div>
                    }
                </div>
            }
        </main>
    )
}

export default AllServices