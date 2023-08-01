import { useQuery } from "@tanstack/react-query";
import getProfileInfo from "../services/getProfileInfo";
import { AxiosError } from "axios";
import { useAppDispatch } from "../../../hooks/redux";
import { authAction } from "../../auth/redux/auth";

const useProfileInfoQuery = () => {
    const dispatch = useAppDispatch();
    const profileInfoQuery = useQuery({
        queryKey: ["profileInfo"],
        queryFn: getProfileInfo,
        retry: false,
        refetchOnWindowFocus: false,
        onError: (error: AxiosError<{ msg: string }>) => {
            if (error.response?.status === 401) {
                dispatch(authAction.setUser(null));
            }
        }
    });
    return profileInfoQuery;
}

export default useProfileInfoQuery