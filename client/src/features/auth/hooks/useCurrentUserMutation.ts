import { useMutation } from "@tanstack/react-query";
import getCurrentUserRequest from "../services/getCurrentUser";
import { useAppDispatch } from "../../../hooks/redux";
import { authAction } from "../redux/auth";

const useCurrentUserMutation = () => {
    const dispatch = useAppDispatch();
    const currentUserMutation = useMutation({
        mutationFn: getCurrentUserRequest,
        onSuccess: ({ data }) => {
            dispatch(authAction.setUser({ ...data }));
        },
        onError: () => {
            dispatch(authAction.setUser(null));
        }
    });
    return currentUserMutation;
}

export default useCurrentUserMutation;