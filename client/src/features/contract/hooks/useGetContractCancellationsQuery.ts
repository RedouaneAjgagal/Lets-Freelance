import { useQuery } from "@tanstack/react-query";
import getContractCancellations from "../services/getContractCancellations";

const useGetContractCancellationsQuery = () => {
    const getContractCancellationsQuery = useQuery({
        queryKey: ["contractCancellations"],
        queryFn: () => getContractCancellations(),
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true
    });

    return getContractCancellationsQuery;
}

export default useGetContractCancellationsQuery