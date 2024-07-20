import { Link } from "react-router-dom";


interface Props {
    to: string;
    justifyConent: "start" | "center" | "end";
    fullWith: boolean;
    y: "sm" | "md" | "lg";
    x: "sm" | "md" | "lg";
    outline?: boolean;
}

const PrimaryLink = (props: React.PropsWithChildren<Props>) => {
    return (
        <Link to={props.to} className={`px-${props.x === "sm" && "1" || props.x === "md" && "2" || props.x === "lg" && "3"} py-${props.y === "sm" && "1" || props.y === "md" && "2" || props.y === "lg" && "3"} justify-${props.justifyConent} ${props.fullWith ? "w-full" : `self-${props.justifyConent}`} border-2 border-purple-800 font-semibold flex items-center gap-2 rounded transition-all duration-200  ${props.outline ? "bg-transparent text-purple-800 hover:bg-purple-800 hover:text-white" : "text-white bg-purple-800 hover:bg-purple-700"}`}>
            {props.children}
        </Link>
    )
}

export default PrimaryLink