import { useLogoutMutation, useCurrentUserMutation } from "../features/auth";
import { useAppSelector } from "./redux";
import { useEffect } from "react";


const useAuthChecker = () => {
    const currentUserMutation = useCurrentUserMutation();
    const logoutMutation = useLogoutMutation("Expired Token");
    const { userInfo } = useAppSelector(state => state.authReducer);

    let isChecked = false; // to prevent calling useEffect twice
    useEffect(() => {
        if (isChecked) return;
        isChecked = true;

        currentUserMutation.mutate();
    }, []);

    useEffect(() => {
        const currentTime = new Date(Date.now()).getTime();
        const exp: number = userInfo?.expirationDate || 0;

        const checkExpiration = setTimeout(() => {
            if (userInfo) {
                logoutMutation.mutate();
            }
        }, exp - currentTime);

        return () => clearTimeout(checkExpiration);
    }, [userInfo]);



    return null;
}

export default useAuthChecker;