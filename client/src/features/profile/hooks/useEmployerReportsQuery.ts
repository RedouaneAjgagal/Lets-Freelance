import getEmployerReports from "../services/getEmployerReports";
import { useQuery } from "@tanstack/react-query";

const useEmployerReportsQuery = () => {
    const employerReportsQuery = useQuery({
        queryKey: ["employerReports"],
        queryFn: getEmployerReports,
        refetchOnWindowFocus: false,
        retry: false
    });

    return employerReportsQuery;
}

export default useEmployerReportsQuery;