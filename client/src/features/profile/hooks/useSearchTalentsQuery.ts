import { useQuery } from '@tanstack/react-query';
import getFreelancers from '../services/getFreelancers';
import useSearchedTalentsQueries from './useSearchedTalentsQueries';

const useSearchTalentsQuery = () => {
    const searchedTalentsQueries = useSearchedTalentsQueries();

    const searchTalentsQuery = useQuery({
        queryKey: ["telents"],
        queryFn: () => getFreelancers(searchedTalentsQueries),
        retry: false,
        refetchOnWindowFocus: false
    });

    return searchTalentsQuery;
}

export default useSearchTalentsQuery