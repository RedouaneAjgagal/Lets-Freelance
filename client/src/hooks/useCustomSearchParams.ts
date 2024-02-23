import { useSearchParams } from "react-router-dom";

const useCustomSearchParams = () => {
    const [URLSearchParams, SetURLSearchParams] = useSearchParams();

    return {
        setSearchParams: ({ key, value, removePrev }: { key: string; value: string; removePrev?: boolean }) => {
            SetURLSearchParams((prev) => {
                const searchedQueries: { [key: string]: string } = {};

                if (!removePrev) {
                    prev.forEach((prevValue, prevKey) => {
                        searchedQueries[prevKey] = prevValue;
                    });
                }

                searchedQueries[key] = value;

                if (value.trim() === "") {
                    delete searchedQueries[key];
                }

                return searchedQueries
            });
        },
        getSearchParams: ({ key }: { key: string }) => {
            const getQuery = URLSearchParams.get(key);
            return getQuery;
        }
    };
}

export default useCustomSearchParams