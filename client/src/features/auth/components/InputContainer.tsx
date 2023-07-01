import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { registerAction } from "../redux/register";
import { loginAction } from "../redux/login";
import { forgetPasswordAction } from "../redux/forgetPassword";

interface Props {
    requiredSign: boolean;
    label: string;
    placeholder: string;
    name: string;
    type: "text" | "email" | "password";
    for: "name" | "email" | "password";
    error?: {
        isError: boolean;
        reason: string;
    }
    form: "register" | "login" | "forgetPassword" | "resetPassword";
}

const InputContainer = (props: React.PropsWithoutRef<Props>) => {
    const dispatch = useAppDispatch();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const passwordToggleHandler = () => {
        setIsPasswordVisible((isVisible) => !isVisible);
    }

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.for === "name") {
            if (props.form === "register") dispatch(registerAction.name(e.currentTarget.value));
        }

        if (props.for === "email") {
            if (props.form === "register") dispatch(registerAction.email(e.currentTarget.value));
            if (props.form === "login") dispatch(loginAction.email(e.currentTarget.value));
            if (props.form === "forgetPassword") dispatch(forgetPasswordAction.email(e.currentTarget.value));
        }

        if (props.for === "password") {
            if (props.form === "register") dispatch(registerAction.password(e.currentTarget.value));
            if (props.form === "login") dispatch(loginAction.password(e.currentTarget.value));
        }

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
                <input onChange={inputChangeHandler} type={isPasswordVisible ? "text" : props.type} id={props.name} name={props.name} placeholder={props.placeholder} className={`${props.type === "password" && "pr-8"} ${props.error?.isError ? "border-red-600" : "border-slate-300"} border  rounded py-2 px-3 outline-none focus:border-slate-500 w-full`} />
                {props.error?.isError && <span className="absolute right-0 -bottom-5 text-sm text-red-600">{props.error?.reason}</span>}
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