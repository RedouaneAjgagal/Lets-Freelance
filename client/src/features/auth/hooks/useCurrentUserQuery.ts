import { useQuery } from "@tanstack/react-query";
import getCurrentUserRequest from "../services/getCurrentUser";
import { useAppDispatch } from "../../../hooks/redux";
import { authAction } from "../redux/auth";
import { connectWebsocket } from "../../message";

const useCurrentUserQuery = () => {
    const dispatch = useAppDispatch();

    const currentUserQuery = useQuery({
        queryKey: ["currentUserInfo"],
        queryFn: getCurrentUserRequest,
        suspense: true,
        useErrorBoundary: false,
        retry: false,
        refetchOnWindowFocus: false,
        onSuccess: ({ data }) => {
            dispatch(connectWebsocket({
                userId: data.profileId
            }));

            dispatch(authAction.setUser(data));
        },
        onError: () => {
            dispatch(authAction.setUser(null));
        }
    });
    return currentUserQuery;
}

export default useCurrentUserQuery