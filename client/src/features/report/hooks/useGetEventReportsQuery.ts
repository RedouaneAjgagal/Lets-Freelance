import { useQuery } from "@tanstack/react-query";
import getEventReports, { GetEventReportsPayload } from "../services/getEventReports";

const useGetEventReportsQuery = (payload: GetEventReportsPayload) => {
    const getEventReportsQuery = useQuery({
        queryKey: ["eventReports"],
        queryFn: () => getEventReports(payload),
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true,
        keepPreviousData: true
    });

    return getEventReportsQuery;
}

export default useGetEventReportsQuery