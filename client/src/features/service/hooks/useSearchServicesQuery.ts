import { useQuery } from '@tanstack/react-query'
import searchServices, { SearchServicesQuery } from '../services/searchServices'

const useSearchServicesQuery = (searchQuery: SearchServicesQuery) => {
    const searchServicesQuery = useQuery({
        queryKey: ["searchServices"],
        queryFn: () => searchServices(searchQuery),
        retry: false,
        refetchOnWindowFocus: false
    });

    return searchServicesQuery;
}

export default useSearchServicesQuery