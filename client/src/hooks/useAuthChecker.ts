import { useLogoutMutation, useCurrentUserMutation } from "../features/auth";
import { useAppSelector } from "./redux";
import { useEffect } from "react";


const useAuthChecker = () => {
    const currentUserMutation = useCurrentUserMutation();
    const logoutMutation = useLogoutMutation("Expired Token");
    const { userInfo } = useAppSelector(state => state.authReducer);

    
    const getExp: number = JSON.parse(localStorage.getItem("exp") || "0");
    const currentTime = new Date(Date.now()).getTime();
    const remainingTime = getExp - currentTime
    const isExpiredToken = remainingTime < 0;

    let isChecked = false; // to prevent calling useEffect twice
    useEffect(() => {
        if (isChecked) return;
        isChecked = true;

        if (getExp && isExpiredToken) {
            logoutMutation.mutate();
            return;
        }
        currentUserMutation.mutate();
    }, [isChecked]);

    useEffect(() => {
        const checkExpiration = setTimeout(() => {
            if (!isExpiredToken) {
                logoutMutation.mutate();
            }
        }, remainingTime)

        return () => clearTimeout(checkExpiration);

    }, [remainingTime, isExpiredToken, userInfo]);

    return null;
}

export default useAuthChecker;