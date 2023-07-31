import { useAppSelector } from "../../hooks/redux";
import { useState } from "react";
import UserMenu from "./UserMenu";

const UserNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { userInfo } = useAppSelector(state => state.authReducer);
    const userMenuHandler = () => {
        setIsMenuOpen(isOpen => !isOpen);
    }
    return (
        <>
            <span role="button" onClick={userMenuHandler}>
                <div className="min-h-full max-w-full">
                    <img src={userInfo!.avatar} alt={`${userInfo!.userName}'s profile image`} className="rounded-full w-11 h-11 object-cover shadow-md" />
                </div>
            </span>
            {isMenuOpen ?
                <UserMenu />
                :
                null
            }
        </>
    )
}

export default UserNav