import { useAppSelector } from "../../../hooks/redux";
import getEmployerJobs from "../service/getEmployerJobs";
import { useQuery } from "@tanstack/react-query";

const useEmployerJobsQuery = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const employerJobsQuery = useQuery({
        queryKey: ["employerJobs", userInfo!.profileId],
        queryFn: getEmployerJobs,
        retry: false,
        refetchOnWindowFocus: false
    });

    return employerJobsQuery;
}

export default useEmployerJobsQuery;