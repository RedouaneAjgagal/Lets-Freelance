import { useQuery } from "@tanstack/react-query";
import getJobs from "../service/getJobs";
import { useSearchParams } from "react-router-dom";
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries";

const useGetJobsQuery = () => {
    const [URLSearchParams] = useSearchParams();

    const searchedQueries = getOnlyValidJobSearchedQueries(URLSearchParams);

    const getJobsQuery = useQuery({
        queryKey: ["jobs"],
        queryFn: () => getJobs(searchedQueries),
        retry: false,
        refetchOnWindowFocus: false
    })

    return getJobsQuery;
}

export default useGetJobsQuery;