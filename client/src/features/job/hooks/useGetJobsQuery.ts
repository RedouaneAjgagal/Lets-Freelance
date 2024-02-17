import { useQuery } from "@tanstack/react-query";
import getJobs, { GetJobsPayload } from "../service/getJobs";

const useGetJobsQuery = (payload: GetJobsPayload) => {
    const getJobsQuery = useQuery({
        queryKey: ["jobs"],
        queryFn: () => getJobs(payload),
        retry: false,
        refetchOnWindowFocus: false
    })

    return getJobsQuery;
}

export default useGetJobsQuery;