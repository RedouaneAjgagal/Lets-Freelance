import { useQuery } from "@tanstack/react-query";
import getSingleJob from "../service/getSingleJob";
import { useParams } from "react-router-dom";

const useGetSingleJobQuery = () => {
    const { jobId } = useParams();

    const getSingleJobQuery = useQuery({
        queryKey: ["jobs", jobId],
        queryFn: () => getSingleJob(jobId!),
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true
    });
    
    return getSingleJobQuery;
}

export default useGetSingleJobQuery