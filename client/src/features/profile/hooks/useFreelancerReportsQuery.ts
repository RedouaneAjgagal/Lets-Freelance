import { useAppSelector } from "../../../hooks/redux";
import getFreelancerReports from "../services/getFreelancerReports";
import { useQuery } from "@tanstack/react-query";

const useFreelancerReportsQuery = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const freelancerReportsQuery = useQuery({
        queryKey: ["freelancerReports", userInfo!.profileId],
        queryFn: getFreelancerReports,
        retry: false,
        refetchOnWindowFocus: false
    });

    return freelancerReportsQuery;
}

export default useFreelancerReportsQuery;