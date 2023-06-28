import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

interface Props {
    requiredSign: boolean;
    label: string;
    placeholder: string;
    name: string;
    type: "text" | "email" | "password"
}

const InputContainer = (props: React.PropsWithoutRef<Props>) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const passwordToggleHandler = () => {
        setIsPasswordVisible((isVisible) => !isVisible);
    }

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={props.name} className="flex gap-1">
                {props.label}
                {props.requiredSign ?
                    <span className="text-red-600">*</span>
                    :
                    null
                }
            </label>
            <div className="relative">
                <input type={isPasswordVisible ? "text" : props.type} id={props.name} name={props.name} placeholder={props.placeholder} className={`${props.type === "password" && "pr-8"} border border-slate-300 rounded py-2 px-3 outline-none focus:border-slate-500 w-full`} />
                {props.type === "password" ?
                    <button onClick={passwordToggleHandler} type="button" className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-2 text-slate-800">
                        {isPasswordVisible ?
                            <FaEye />
                            :
                            <FaEyeSlash />
                        }
                    </button>
                    :
                    null
                }
            </div>
        </div>
    )
}

export default InputContainer