import { useInfiniteQuery } from '@tanstack/react-query'
import searchServices, { SearchServicesQuery } from '../services/searchServices'

const useSearchServicesQuery = (searchQuery: SearchServicesQuery) => {

    const searchedServices = searchServices(searchQuery);

    const searchServicesQuery = useInfiniteQuery({
        queryKey: ["searchServices"],
        queryFn: searchedServices,
        enabled: false,
        retry: false,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
            if (pages.length >= lastPage.numOfPages) {
                return undefined;
            }

            return pages.length + 1;
        }
    });

    return searchServicesQuery;
}

export default useSearchServicesQuery