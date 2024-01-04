import { useAppSelector } from "../../../hooks/redux";
import getEmployerReports from "../services/getEmployerReports";
import { useQuery } from "@tanstack/react-query";

const useEmployerReportsQuery = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const employerReportsQuery = useQuery({
        queryKey: ["employerReports", userInfo!.profileId],
        queryFn: getEmployerReports,
        refetchOnWindowFocus: false,
        retry: false
    });

    return employerReportsQuery;
}

export default useEmployerReportsQuery;