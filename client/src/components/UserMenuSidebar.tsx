import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux"
import UserMenu from "../layouts/navbar/UserMenu"

const UserMenuSidebar = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    return (
        !userInfo
            ? <Navigate to={"/auth/login"} />
            : <div className="hidden lg:min-h-full lg:mt-0 xl:min-h-[99%] xl:mt-4 lg:shadow-sm xl:rounded lg:grid lg:col-span-3 lg:bg-white lg:px-4 xl:mx-4">
                <UserMenu isSidebar role={userInfo.role} userInfo={userInfo} />
            </div>
    )
}

export default UserMenuSidebar