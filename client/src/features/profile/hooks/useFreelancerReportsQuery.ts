import getFreelancerReports from "../services/getFreelancerReports";
import { useQuery } from "@tanstack/react-query";

const useFreelancerReportsQuery = () => {
    const freelancerReportsQuery = useQuery({
        queryKey: ["freelancerReports"],
        queryFn: getFreelancerReports,
        retry: false,
        refetchOnWindowFocus: false
    });

    return freelancerReportsQuery;
}

export default useFreelancerReportsQuery;