import getProfileStatements from "../services/getProfileStatements";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../../hooks/redux";

const useProfileStatementsQuery = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const profileStatementsQuery = useQuery({
        queryKey: ["profileStatements", userInfo!.profileId],
        queryFn: getProfileStatements,
        retry: false,
        refetchOnWindowFocus: false
    });

    return profileStatementsQuery;
}

export default useProfileStatementsQuery