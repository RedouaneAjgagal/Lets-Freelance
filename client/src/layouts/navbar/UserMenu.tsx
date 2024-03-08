import { User, useLogoutMutation } from "../../features/auth";
import { TbSmartHome, TbChecklist, TbBriefcase, TbMessage, TbAppWindow, TbReportMoney, TbSquareRoundedPlus, TbSettings, TbLogout, TbX, TbHeart, TbShare } from "react-icons/tb";
import { LuFileSignature } from "react-icons/lu";
import UserMenuLink from "./UserMenuLink";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Overlay from "../Overlay";
import { useEffect, useRef } from "react";
import { IconType } from "react-icons";

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

    const location = useLocation();

    useEffect(() => {
        if (props.isMenuOpen) userMenuRef.current!.scroll({ top: 0 });
    }, [props.isMenuOpen]);

    const navigator = (url: string) => {
        navigate(url);
        closeMenuHandler();
    }

    const generalMenus: { to: string; value: string; icon: IconType, sort: number }[] = [
        {
            value: "Dashboard",
            icon: TbSmartHome,
            to: "/profile/dashboard",
            sort: 1
        },
        {
            value: "Favorites",
            icon: TbHeart,
            to: "/profile/favorites",
            sort: 4
        },
        {
            value: "Messages",
            icon: TbMessage,
            to: "/profile/messages",
            sort: 6
        },
        {
            value: "Statements",
            icon: TbAppWindow,
            to: "/profile/statements",
            sort: 8
        },
        {
            value: "Contracts",
            icon: LuFileSignature,
            to: "/profile/contracts",
            sort: 9
        },
        {
            value: "Settings",
            icon: TbSettings,
            to: "/profile/settings",
            sort: 10
        },
    ];

    const freelancerMenus: { to: string; value: string; icon: IconType, sort: number }[] = [
        {
            value: "My Services",
            icon: TbBriefcase,
            to: "/profile/freelancer/services",
            sort: 2
        },
        {
            value: "My Proposals",
            icon: TbChecklist,
            to: "/profile/freelancer/proposals",
            sort: 3
        },
        {
            value: "Connects",
            icon: TbShare,
            to: "/profile/freelancer/connects",
            sort: 5
        },
        {
            value: "Submission Service",
            icon: TbSquareRoundedPlus,
            to: "/profile/freelancer/service/create",
            sort: 7
        },
    ];

    const employerMenus: { to: string; value: string; icon: IconType; sort: number }[] = [
        {
            value: "My Jobs",
            icon: TbBriefcase,
            to: "/profile/employer/jobs",
            sort: 2
        },
        {
            value: "Bought Services",
            icon: TbReportMoney,
            to: "/profile/employer/bought-services",
            sort: 3
        },
        {
            value: "Submission Job",
            icon: TbSquareRoundedPlus,
            to: "/profile/employer/jobs/create",
            sort: 7
        },
    ];

    const selectedMenu = props.userInfo.userAs === "freelancer" ? freelancerMenus : employerMenus;
    const userMenu = [...selectedMenu, ...generalMenus];

    userMenu.sort((a, b) => a.sort - b.sort)

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
                    {
                        userMenu.map(menu => (
                            <UserMenuLink key={menu.value} onClick={() => navigator(menu.to)} isActive={location.pathname === menu.to}>
                                <menu.icon className="text-2xl" />{menu.value}
                            </UserMenuLink>
                        ))
                    }
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