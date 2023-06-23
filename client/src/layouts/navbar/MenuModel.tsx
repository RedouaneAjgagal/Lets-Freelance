import { Link } from "react-router-dom";

interface Props {
    isShown: boolean;
}

const MenuModel = (props: React.PropsWithoutRef<Props>) => {
    return (
        <ul className={`bg-white min-h-screen fixed w-full duration-150 flex flex-col py-4 text-lg  text-slate-600 ${props.isShown ? "left-0" : "-left-full"}`}>
            <li><Link to="/" className="py-2 px-4 flex">Home</Link></li>
            <li><Link to="/" className="py-2 px-4 flex">Find Talent</Link></li>
            <li><Link to="/" className="py-2 px-4 flex">Find Work</Link></li>
            <li><Link to="/" className="py-2 px-4 flex">Login</Link></li>
        </ul>
    )
}

export default MenuModel