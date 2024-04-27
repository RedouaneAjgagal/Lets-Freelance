import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

interface Props {
    isShown: boolean;
    onClick: () => void;
}

const MenuModel = (props: React.PropsWithoutRef<Props>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    return (
        <ul className={`bg-white min-h-screen fixed w-full duration-150 flex flex-col py-4 text-lg  text-slate-600 font-medium z-[90] ${props.isShown ? "left-0" : "-left-full"}`}>
            <li><Link onClick={props.onClick} to="/" className="py-2 px-4 flex">Home</Link></li>
            <li><Link onClick={props.onClick} to="/profiles" className="py-2 px-4 flex">Find Talent</Link></li>
            <li><Link onClick={props.onClick} to="/services" className="py-2 px-4 flex">Find Service</Link></li>
            <li><Link onClick={props.onClick} to="/jobs" className="py-2 px-4 flex">Find Work</Link></li>
            {userInfo ?
                <li><Link onClick={props.onClick} to="/profile/settings" className="py-2 px-4 flex">My Profile</Link></li>
                : <li><Link onClick={props.onClick} to="/auth/login" className="py-2 px-4 flex">Login</Link></li>
            }
        </ul>
    )
}

export default MenuModel