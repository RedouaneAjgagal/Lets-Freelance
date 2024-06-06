import { useMutation, useQueryClient } from '@tanstack/react-query'
import cancelContractRequest from '../services/cancelContractRequest'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

const useCancelContractRequestMutation = () => {
  const queryClient = useQueryClient();

  const cancelContractRequestMutation = useMutation({
    mutationFn: cancelContractRequest,
    retry: false,
    onSuccess: (data) => {
      toast.success(data.msg, {
        id: "success_cancelContractRequest",
        duration: 3000
      });

      queryClient.invalidateQueries({ queryKey: ["contractCancellations"] });
    },
    onError: (error: AxiosError<{ msg: string }>) => {
      const errorMsg = error.response?.data.msg || "Something went wrong";
      toast.error(errorMsg, {
        id: "error_cancelContractRequest",
        duration: 5000
      });
    }
  });

  return cancelContractRequestMutation
}

export default useCancelContractRequestMutation