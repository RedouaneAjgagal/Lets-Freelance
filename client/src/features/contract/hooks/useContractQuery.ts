import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import getUserSingleContract from "../services/getUserSingleContract";


const useContractQuery = () => {
    const { contractId } = useParams();

    const contractQuery = useQuery({
        queryKey: ["singleContract", contractId],
        queryFn: () => getUserSingleContract(contractId!),
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true
    });

    return contractQuery;
}

export default useContractQuery