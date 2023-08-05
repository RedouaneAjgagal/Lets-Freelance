interface Props {
    onClick?: () => void;
    style: "outline" | "solid";
    type: "button" | "submit" | "reset";
    fullWith: boolean;
    justifyConent: "start" | "center" | "end";
    y: "sm" | "md" | "lg";
    x: "sm" | "md" | "lg";
    disabled: boolean;
}

const PrimaryButton = (props: React.PropsWithChildren<Props>) => {
    const style = props.style === "outline" ? "border-2 border-purple-800 bg-transparent text-purple-800" : "text-white bg-purple-800";
    return (
        <button disabled={props.disabled} type={props.type} onClick={props.onClick} className={`${style} px-${props.x === "sm" && "1" || props.x === "md" && "2" || props.x === "lg" && "3"} py-${props.y === "sm" && "1" || props.y === "md" && "2" || props.y === "lg" && "3"} justify-${props.justifyConent} ${props.fullWith ? "w-full" : `self-${props.justifyConent}`} font-semibold flex items-center gap-2 rounded`}>
            {props.children}
        </button>
    )
}

export default PrimaryButton