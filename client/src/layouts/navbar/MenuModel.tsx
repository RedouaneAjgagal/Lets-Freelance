import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import { BiSearch, BiX } from "react-icons/bi";
import { Logo } from "../brand";

interface Props {
    isShown: boolean;
    onClick: () => void;
    onSearch: () => void;
}

const MenuModel = (props: React.PropsWithoutRef<Props>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    return (
        <div className={`bg-white min-h-screen fixed w-full duration-150 flex flex-col text-lg text-slate-600 font-medium top-0 z-[90] gap-2 ${props.isShown ? "left-0" : "-left-full"} md:min-h-0 md:flex-row md:static md:py-0 md:text-base overflow-y-hidden`}>
            <div className="flex items-center border-b md:hidden">
                <button onClick={props.onClick} className="text-[2.2rem] text-slate-700 px-2 py-3 md:hidden self-start">
                    <BiX />
                </button>
                <Logo />
            </div>
            <ul className="flex flex-col md:flex-row w-full md:items-center ">
                <li className="md:hidden"><Link onClick={props.onClick} to="/" className="py-2 px-4 xl:px-4 flex md:hidden">Home</Link></li>
                <li>
                    <Link onClick={props.onClick} to="/profiles" className="py-2 px-4 xl:px-4 flex md:px-3 md:hover:text-purple-700 md:transition-all">Find Talent</Link>
                </li>
                <li>
                    <Link onClick={props.onClick} to="/services" className="py-2 px-4 xl:px-4 flex md:px-3 md:hover:text-purple-700 md:transition-all">Find Service</Link>
                </li>
                <li className="">
                    <Link onClick={props.onClick} to="/jobs" className="py-2 px-4 xl:px-4 flex md:px-3 md:hover:text-purple-700 md:transition-all">Find Work</Link>
                </li>
                <li className="md:ml-auto md:flex md:items-center md:gap-2">
                    <button onClick={props.onSearch} className="flex text-2xl text-slate-700 hover:text-slate-900 transition-all absolute top-3 right-2 p-2 md:static lg:hidden">
                        <BiSearch />
                    </button>
                    {!userInfo
                        ? <Link onClick={props.onClick} to="/auth/login" className="py-2 px-4 xl:px-4 flex md:px-3 hover:text-slate-900 transition-all md:hidden">Login</Link>
                        : null
                    }
                </li>
            </ul>
            {!userInfo
                ? <Link onClick={props.onClick} to={"/auth/register"} className="p-3 flex justify-center bg-purple-800 text-white text-lg tracking-wide font-medium rounded-t-lg absolute bottom-0 left-0 w-full md:hidden">Register</Link>
                : null
            }
        </div>
    )
}

export default MenuModel