import { useQuery } from "@tanstack/react-query";
import getJobs from "../service/getJobs";
import { useSearchParams } from "react-router-dom";
import getJobSerchedQuries from "../utils/getJobSerchedQuries";
import getValidJobSearchedQueries from "../validators/getValidJobSearchedQueries";

const useGetJobsQuery = () => {
    const [URLSearchParams] = useSearchParams();

    const jobSearchedQueries = getJobSerchedQuries(URLSearchParams);

    const searchedQueries = getValidJobSearchedQueries(jobSearchedQueries);

    const getJobsQuery = useQuery({
        queryKey: ["jobs"],
        queryFn: () => getJobs(searchedQueries),
        retry: false,
        refetchOnWindowFocus: false
    })

    return getJobsQuery;
}

export default useGetJobsQuery;