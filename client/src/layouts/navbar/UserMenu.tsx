import { User, useLogoutMutation } from "../../features/auth";
import { TbSmartHome, TbFileDollar, TbChecklist, TbBriefcase, TbMessage, TbAppWindow, TbMoneybag, TbSquareRoundedPlus, TbSettings, TbLogout, TbX } from "react-icons/tb";
import UserMenuLink from "./UserMenuLink";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Overlay from "../Overlay";
import { useEffect, useRef } from "react";

interface Props {
    userInfo: User;
    isMenuOpen: boolean;
    onCloseMenu: () => void;
}

const UserMenu = (props: React.PropsWithoutRef<Props>) => {
    const userMenuRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();
    const logoutMutation = useLogoutMutation("Logged out");
    const logoutHandler = () => {
        logoutMutation.mutate();
        closeMenuHandler();
    }

    const closeMenuHandler = () => {
        props.onCloseMenu();
    }

    const settingsHandler = () => {
        navigate("/profile/settings");
        closeMenuHandler();
    }

    const location = useLocation();

    useEffect(() => {
        if (props.isMenuOpen) userMenuRef.current!.scroll({ top: 0 });
    }, [props.isMenuOpen]);

    return (
        <>
            {props.isMenuOpen ? <Overlay onClose={closeMenuHandler} /> : null}
            <div className={`fixed h-screen top-0 w-5/6 flex flex-col gap-4 z-50 p-3 rounded-l bg-white overflow-y-scroll duration-200 ${props.isMenuOpen ? "right-0" : "-right-full"}`} ref={userMenuRef}>
                <div className="flex justify-end">
                    <button onClick={closeMenuHandler} className="text-xl bg-slate-500 text-white rounded p-2"><TbX /></button>
                </div>
                <div className="flex items-center gap-3 px-2 py-1">
                    <img src={props.userInfo.avatar} alt={`${props.userInfo.userName}'s profile avatar`} className="w-20 h-20 rounded-full object-cover" />
                    <div className="flex flex-col gap-1 text-slate-950 font-medium">
                        <h6 className="text-lg">{props.userInfo.userName}</h6>
                        <Link to={`/profiles/${props.userInfo.profileId}`} onClick={closeMenuHandler} className="underline text-sm self-start">View Profile</Link>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <UserMenuLink onClick={settingsHandler} isActive={false}>
                        <TbSmartHome className="text-2xl" />Dashboard
                    </UserMenuLink>
                    <UserMenuLink onClick={settingsHandler} isActive={false}>
                        <TbBriefcase className="text-2xl" />My Services
                    </UserMenuLink>
                    <UserMenuLink onClick={settingsHandler} isActive={false}>
                        <TbFileDollar className="text-2xl" />Proposals
                    </UserMenuLink>
                    <UserMenuLink onClick={settingsHandler} isActive={false}>
                        <TbChecklist className="text-2xl" />Jobs Applied
                    </UserMenuLink>
                    <UserMenuLink onClick={settingsHandler} isActive={false}>
                        <TbMessage className="text-2xl" />Messages
                    </UserMenuLink>
                    <UserMenuLink onClick={settingsHandler} isActive={false}>
                        <TbAppWindow className="text-2xl" />Statements
                    </UserMenuLink>
                    <UserMenuLink onClick={settingsHandler} isActive={false}>
                        <TbMoneybag className="text-2xl" />Payouts
                    </UserMenuLink>
                    <UserMenuLink onClick={settingsHandler} isActive={false}>
                        <TbSquareRoundedPlus className="text-2xl" />Submission Service
                    </UserMenuLink>
                    <UserMenuLink onClick={settingsHandler} isActive={location.pathname === "/profile/settings"}>
                        <TbSettings className="text-2xl" />Settings
                    </UserMenuLink>
                </div>
                <div className="text-red-600 border-t pt-2">
                    <UserMenuLink onClick={logoutHandler} isActive={false}>
                        <TbLogout className="text-2xl rotate-180" />Logout
                    </UserMenuLink>
                </div>
            </div>
        </>
    )
}

export default UserMenu