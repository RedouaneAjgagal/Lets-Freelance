import { useQuery } from "@tanstack/react-query"
import verifyEmailRequest from "../services/verifyEmail";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";

const useVerifyEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tokenQuery = searchParams.get("token") || "";
    const emailQuery = searchParams.get("email") || "";

    const verifyEmailMutation = useQuery({
        queryKey: ["emailVerification"],
        queryFn: () => verifyEmailRequest({
            token: tokenQuery,
            email: emailQuery
        }),
        onSuccess: ({ data }) => {
            toast.success(data.msg, { duration: 5000 });
            navigate("/");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong!";
            toast.error(errorMsg), { duration: 5000 };
            navigate("/");
        },
        retry: false,
        refetchOnWindowFocus: false
    });

    return verifyEmailMutation
}
export default useVerifyEmail;