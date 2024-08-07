import { useAppSelector } from "../../hooks/redux";
import { useState } from "react";
import UserMenu from "./UserMenu";
import useOverflow from "../../hooks/useOverflow";

const UserNav = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { userInfo } = useAppSelector(state => state.authReducer);
    const userMenuHandler = () => {
        setIsUserMenuOpen(isOpen => !isOpen);
    }

    const closeMenuHandler = () => {
        setIsUserMenuOpen(false);
    }

    useOverflow(isUserMenuOpen);

    return (
        <>
            <span role="button" onClick={userMenuHandler}>
                <div className="min-h-full max-w-full">
                    <img src={userInfo!.avatar} alt={`${userInfo!.userName}'s profile image`} className="rounded-full min-w-[2.75rem] max-w-[2.75rem] min-h-[2.75rem] max-h-[2.75rem] object-cover" />
                </div>
            </span>
            <UserMenu userInfo={userInfo!} isMenuOpen={isUserMenuOpen} onCloseMenu={closeMenuHandler} role={userInfo!.role} />
        </>
    )
}

export default UserNav