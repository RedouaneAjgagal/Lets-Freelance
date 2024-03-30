import { TbLoader } from "react-icons/tb";

type AdverisementPrimaryButtonProps = {
    onClick: () => void;
    type: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
    isLoading?: boolean;
    fullWidth?: boolean;
}

type AdverisementPrimarySubmitButtonProps = {
    type: "submit";
    isLoading?: boolean;
    fullWidth?: boolean;
}

const AdverisementPrimaryButton = (props: React.PropsWithChildren<AdverisementPrimaryButtonProps | AdverisementPrimarySubmitButtonProps>) => {
    return (
        <button onClick={props.type !== "submit" ? props.onClick : undefined} type={props.type} disabled={props.isLoading} className={`flex justify-center items-center border-2 border-slate-600 font-semibold h-10 rounded bg-amber-500 relative px-2 ${props.fullWidth ? "w-full" : "w-auto"}`}>
            {props.isLoading ?
                <>
                    <span className="invisible absolute">
                        {props.children}
                    </span>
                    <TbLoader size={24} className="animate-spin" />
                </>
                : props.children
            }
        </button>
    )
}

export default AdverisementPrimaryButton