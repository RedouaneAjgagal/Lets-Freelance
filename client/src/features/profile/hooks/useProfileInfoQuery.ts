import { useQuery } from "@tanstack/react-query";
import getProfileInfo from "../services/getProfileInfo";

const useProfileInfoQuery = () => {
    const profileInfoQuery = useQuery({
        queryKey: ["profileInfo"],
        queryFn: getProfileInfo,
        retry: false,
        refetchOnWindowFocus: false,
        useErrorBoundary: true
    });
    return profileInfoQuery;
}

export default useProfileInfoQuery