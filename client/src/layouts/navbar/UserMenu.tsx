import { useLogoutMutation } from "../../features/auth";
import { CiLogout } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import UserMenuLink from "./UserMenuLink";
import { useNavigate } from "react-router-dom";


const UserMenu = () => {
    const navigate = useNavigate();
    const logoutMutation = useLogoutMutation("Logged out");
    const logoutHandler = () => {
        logoutMutation.mutate();
    }

    const settingsHandler = () => {
        navigate("/profile/settings");
    }

    return (
        <div className="absolute right-0 top-12 bg-white w-48 shadow-sm z-30 p-2 rounded border">
            <UserMenuLink onClick={settingsHandler}><IoSettingsOutline size="1.1rem" />Settings</UserMenuLink>
            <UserMenuLink onClick={logoutHandler}><CiLogout size="1.1rem" />Logout</UserMenuLink>
        </div>
    )
}

export default UserMenu