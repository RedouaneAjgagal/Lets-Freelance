import { TbLoader2 } from "react-icons/tb";

interface Props {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    style: "outline" | "solid";
    type: "button" | "submit" | "reset";
    fullWith: boolean;
    justifyConent: "start" | "center" | "end";
    y: "sm" | "md" | "lg";
    x: "sm" | "md" | "lg";
    disabled: boolean;
    isLoading?: boolean;
    inactive?: boolean;
}

const PrimaryButton = (props: React.PropsWithChildren<Props>) => {
    const style = props.style === "outline" ? "border-2 border-purple-800 bg-transparent text-purple-800"
        : props.inactive ? "text-slate-500 bg-slate-200/60"
            : "text-white bg-purple-800";

    return (
        <button disabled={props.disabled} type={props.type} onClick={props.onClick} className={`${style} px-${props.x === "sm" && "1" || props.x === "md" && "2" || props.x === "lg" && "3"} py-${props.y === "sm" && "1" || props.y === "md" && "2" || props.y === "lg" && "3"} justify-${props.justifyConent} ${props.fullWith ? "w-full" : `self-${props.justifyConent}`} font-semibold flex items-center gap-2 rounded`}>
            {props.isLoading ?
                <>
                    <span className="invisible">
                        {props.children}
                    </span>
                    <TbLoader2 className="animate-spin absolute" size={20} />
                </>
                : props.children
            }
        </button>
    )
}

export default PrimaryButton