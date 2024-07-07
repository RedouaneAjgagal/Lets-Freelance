import { User, useLogoutMutation } from "../../features/auth";
import { TbSmartHome, TbChecklist, TbBriefcase, TbMessage, TbAppWindow, TbReportMoney, TbSquareRoundedPlus, TbSettings, TbLogout, TbX, TbHeart, TbShare, TbAd, TbReport } from "react-icons/tb";
import { RiRefund2Line } from "react-icons/ri";
import { LuFileSignature } from "react-icons/lu";
import UserMenuLink from "./UserMenuLink";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Overlay from "../Overlay";
import { useEffect, useRef } from "react";
import { IconType } from "react-icons";

type LinkMenuType = {
    to: string;
    value: string;
    icon: IconType;
    sort: number;
    accessRoles: ("user" | "admin" | "owner")[];
};

interface Props {
    userInfo: User;
    isMenuOpen: boolean;
    onCloseMenu: () => void;
    role: "user" | "admin" | "owner";
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

    const generalMenus: LinkMenuType[] = [
        {
            value: "Dashboard",
            icon: TbSmartHome,
            to: "/profile/dashboard",
            accessRoles: ["user", "admin", "owner"],
            sort: 1
        },
        {
            value: "Favorites",
            icon: TbHeart,
            to: "/profile/favorites",
            accessRoles: ["user"],
            sort: 4
        },
        {
            value: "Messages",
            icon: TbMessage,
            to: "/profile/messages",
            accessRoles: ["user"],
            sort: 6
        },
        {
            value: "Statements",
            icon: TbAppWindow,
            to: "/profile/statements",
            accessRoles: ["user"],
            sort: 8
        },
        {
            value: "Contracts",
            icon: LuFileSignature,
            to: "/profile/contracts",
            accessRoles: ["user"],
            sort: 9
        },
        {
            value: "Settings",
            icon: TbSettings,
            to: "/profile/settings",
            accessRoles: ["user"],
            sort: 10
        },
    ];

    const freelancerMenus: LinkMenuType[] = [
        {
            value: "My Services",
            icon: TbBriefcase,
            to: "/profile/freelancer/services",
            accessRoles: ["user"],
            sort: 2
        },
        {
            value: "My Proposals",
            icon: TbChecklist,
            to: "/profile/freelancer/proposals",
            accessRoles: ["user"],
            sort: 3
        },
        {
            value: "Connects",
            icon: TbShare,
            to: "/profile/freelancer/connects",
            accessRoles: ["user"],
            sort: 5
        },
        {
            value: "Submission Service",
            icon: TbSquareRoundedPlus,
            to: "/profile/freelancer/service/create",
            accessRoles: ["user"],
            sort: 7
        },
        {
            value: "Advertisements",
            icon: TbAd,
            to: "/profile/freelancer/advertisements",
            accessRoles: ["user"],
            sort: 11
        },
    ];

    const employerMenus: LinkMenuType[] = [
        {
            value: "My Jobs",
            icon: TbBriefcase,
            to: "/profile/employer/jobs",
            accessRoles: ["user"],
            sort: 2
        },
        {
            value: "Bought Services",
            icon: TbReportMoney,
            to: "/profile/employer/bought-services",
            accessRoles: ["user"],
            sort: 3
        },
        {
            value: "Submission Job",
            icon: TbSquareRoundedPlus,
            to: "/profile/employer/jobs/create",
            accessRoles: ["user"],
            sort: 7
        },
    ];

    const powerfulRolesMenues: LinkMenuType[] = [
        {
            value: "Contract Cancellations",
            icon: LuFileSignature,
            to: "/contracts/cancelation",
            accessRoles: ["admin", "owner"],
            sort: 2
        },
        {
            value: "Refund Requests",
            icon: RiRefund2Line,
            to: "/contracts/payments/refund",
            accessRoles: ["admin", "owner"],
            sort: 3
        },
        {
            value: "Event Reports",
            icon: TbReport,
            to: "/reports",
            accessRoles: ["admin", "owner"],
            sort: 4
        }
    ]

    const selectedMenu = props.userInfo.userAs === "freelancer" ? freelancerMenus : employerMenus;
    const userMenu = [...selectedMenu, ...generalMenus, ...powerfulRolesMenues]
        .filter(menu => menu.accessRoles.includes(props.role));

    userMenu.sort((a, b) => a.sort - b.sort);

    return (
        <>
            {props.isMenuOpen ? <Overlay onClose={closeMenuHandler} /> : null}
            <div className={`fixed h-screen top-0 w-5/6 flex flex-col gap-4 z-50 p-3 rounded-l bg-white overflow-y-scroll duration-200 sm:w-1/2 md:w-1/3 xl:w-1/4 ${props.isMenuOpen ? "right-0" : "-right-full"}`} ref={userMenuRef}>
                <div className="flex justify-end">
                    <button onClick={closeMenuHandler} className="text-xl bg-slate-500 text-white rounded p-2"><TbX /></button>
                </div>
                <div className="flex items-center gap-3 px-2 py-1">
                    <img src={props.userInfo.avatar} alt={`${props.userInfo.userName}'s profile avatar`} className="w-20 h-20 rounded-full object-cover" />
                    <div className="flex flex-col gap-1 text-slate-950 font-medium">
                        <h6 className="text-lg">{props.userInfo.userName}</h6>
                        {props.role === "user" ?
                            <Link to={`/profiles/${props.userInfo.profileId}`} onClick={closeMenuHandler} className="underline text-sm self-start capitalize">View Profile</Link>
                            : <span className={`text-sm uppercase ${props.role === "admin" ? "text-blue-600" : "text-purple-600"}`}>{props.role}</span>
                        }
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