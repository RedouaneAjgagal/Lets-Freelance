import useCustomSearchParams from '../../../hooks/useCustomSearchParams'
import { useQueryClient } from '@tanstack/react-query';

const ClearAllQueriesButton = () => {
    const queryClient = useQueryClient();

    const customSearchParams = useCustomSearchParams();

    const clearAllQueriesHandler = () => {
        const search = customSearchParams.getSearchParams({
            key: "search"
        });

        const isSearchExist = search && search.trim() !== "";

        customSearchParams.setSearchParams({
            key: isSearchExist ? "search" : "",
            value: isSearchExist ? search : "",
            removePrev: true
        });

        queryClient.removeQueries({ queryKey: ["talents"] });
    }

    return (
        <button onClick={clearAllQueriesHandler} className="text-red-600 font-semibold text-sm py-1 ml-2">Clear All</button>
    )
}

export default ClearAllQueriesButton