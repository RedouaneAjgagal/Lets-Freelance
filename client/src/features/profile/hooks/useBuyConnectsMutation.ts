import buyConnects from "../services/buyConnects"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const useBuyConnectsMutation = () => {
  const buyConnectsMutation = useMutation({
    mutationFn: buyConnects,
    onSuccess: (data) => {
      window.open(data.url, "_blank", "noopener noreferrer");
    },
    onError: (error: AxiosError<{ msg: string }>) => {
      toast.error(error.response!.data.msg, { id: "buyConnectsError" });
    }
  });
  return buyConnectsMutation;
}

export default useBuyConnectsMutation