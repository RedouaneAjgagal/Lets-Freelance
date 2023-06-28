interface Props {
    onClick?: () => void;
    type: "button" | "submit" | "reset";
    fullWith: boolean;
    justifyConent: "start" | "center" | "end";
    y: "sm" | "md" | "lg";
    x: "sm" | "md" | "lg";
}

const PrimaryButton = (props: React.PropsWithChildren<Props>) => {
    return (
        <button type={props.type} onClick={props.onClick} className={`px-${props.x === "sm" && "1" || props.x === "md" && "2" || props.x === "lg" && "3"} py-${props.y === "sm" && "1" || props.y === "md" && "2" || props.y === "lg" && "3"} justify-${props.justifyConent} ${props.fullWith ? "w-full" : `self-${props.justifyConent}`} text-white bg-purple-800 font-semibold flex items-center gap-2 rounded`}>
            {props.children}
        </button>
    )
}

export default PrimaryButton