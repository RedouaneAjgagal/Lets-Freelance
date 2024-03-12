import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import getUserSingleContract from "../services/getUserSingleContract";
import { useAppSelector } from "../../../hooks/redux";


const useContractQuery = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const { contractId } = useParams();

    const contractQuery = useQuery({
        queryKey: ["singleContract", contractId, userInfo!.profileId],
        queryFn: () => getUserSingleContract(contractId!),
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true
    });

    return contractQuery;
}

export default useContractQuery