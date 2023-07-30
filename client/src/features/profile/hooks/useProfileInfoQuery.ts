import { useQuery } from "@tanstack/react-query";
import getProfileInfo from "../services/getProfileInfo";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
// import Toaster from "react-hot-toast";

const useProfileInfoQuery = () => {
    const navigate = useNavigate();
    const profileInfoQuery = useQuery({
        queryKey: ["profileInfo"],
        queryFn: getProfileInfo,
        retry: false,
        refetchOnWindowFocus: false,
        onError: (error: AxiosError<{ msg: string }>) => {
            if (error.response?.status === 401) {
                navigate("/auth/login");
            }

        }
    });
    return profileInfoQuery;
}

export default useProfileInfoQuery