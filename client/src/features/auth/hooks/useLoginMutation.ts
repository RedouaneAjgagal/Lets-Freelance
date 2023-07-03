import { useMutation } from "@tanstack/react-query";
import loginRequest from "../services/login";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/redux";
import { authAction } from "../redux/auth";

const useLoginMutation = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: ({ data }) => {
            toast.success(data.msg);
            dispatch(authAction.setUser({ name: "Test demo", avatar: "https://testDemo" }));

            // setup expiration time
            const exipresIn = 2 * 60 * 60 * 1000 // 2h
            const setExpDate = new Date(Date.now() + exipresIn).getTime();
            localStorage.setItem("exp", JSON.stringify(setExpDate));

            navigate("/");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong!";
            toast.error(errorMsg);
        }
    });
    return loginMutation;
}

export default useLoginMutation;