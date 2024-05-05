import { useInfiniteQuery } from '@tanstack/react-query';
import getFreelancers from '../services/getFreelancers';
import useSearchedTalentsQueries from './useSearchedTalentsQueries';

const useInfiniteSearchTalentsQuery = () => {
    const searchedTalentsQueries = useSearchedTalentsQueries();

    const getTalents = getFreelancers(searchedTalentsQueries);

    const searchTalentsQuery = useInfiniteQuery({
        queryKey: ["talents"],
        queryFn: getTalents,
        retry: false,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPages) => {
            return lastPages.cursor
                ? lastPages.cursor + 1
                : undefined;
        }
    });

    return searchTalentsQuery;
}

export default useInfiniteSearchTalentsQuery