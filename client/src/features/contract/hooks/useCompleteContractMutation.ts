import { useMutation, useQueryClient } from '@tanstack/react-query';
import completeContract from '../services/completeContract';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

type UseCompleteContractMutationPayload = {
    contractId: string;
    profileId: string;
}

const useCompleteContractMutation = (payload: UseCompleteContractMutationPayload) => {
    const queryClient = useQueryClient();

    const completeContractMutation = useMutation({
        mutationFn: completeContract,
        retry: false,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["singleContract", payload.contractId, payload.profileId] });

            queryClient.invalidateQueries({ queryKey: ["userContracts", payload.profileId] });

            window.scrollTo({ top: 0, behavior: "instant" });

            toast.success(data.msg, {
                id: "success_completeContract",
                duration: 5000
            });
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";

            toast.error(errorMsg, {
                id: "error_completeContract",
                duration: 5000
            });
        }
    });

    return completeContractMutation;
}

export default useCompleteContractMutation