import { useMutation } from "@tanstack/react-query"
import payWorkedHours from "../services/payWorkedHours"
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const usePayHourlyContractMutation = () => {
    const payHourlyContractMutation = useMutation({
        mutationFn: payWorkedHours,
        retry: false,
        onSuccess: (data) => {
            window.open(data.url, "_blank", "noopener noreferrer");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong";
            toast.error(errorMsg, {
                id: "error_payHourlyContract",
                duration: 5000
            });
        }
    });

    return payHourlyContractMutation;
};

export default usePayHourlyContractMutation;