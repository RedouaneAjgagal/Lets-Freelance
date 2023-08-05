import InputContainer from './InputContainer'
import { PrimaryButton } from '../../../layouts/brand'
import { BiArrowBack } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { useState } from "react";
import QuickAccess from './QuickAccess';
import useLoginMutation from '../hooks/useLoginMutation';
import { emailValidation, passwordValidation } from '../validators/inputValidations';

type SetInput = {
    value: string;
    key: "email" | "password";
    validation: {
        isError: boolean;
        reason: string;
    }
}

const LoginForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);

    const [loginInfo, setLoginInfo] = useState({
        email: {
            value: "",
            isError: true,
            error: "Please provide an email"
        },
        password: {
            value: "",
            isError: true,
            error: "Please provide a password"
        },
    });

    const setInput = ({ value, key, validation }: SetInput) => {
        setLoginInfo(prev => {
            return {
                ...prev,
                [key]: {
                    value,
                    isError: validation.isError,
                    error: validation.reason
                }
            }
        });
    }

    const onChangeEmail = (value: string) => {
        const validation = emailValidation(value);
        setInput({ value, key: "email", validation });
    }

    const onChangePassword = (value: string) => {
        const validation = passwordValidation(value);
        setInput({ value, key: "password", validation });
    }

    const quickAccessToggle = () => {
        setIsQuickAccessOpen(prevState => !prevState);
    }

    const loginMutation = useLoginMutation();

    const submitLoginHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);

        // check if valid values
        if (loginInfo.email.isError || loginInfo.password.isError) {
            return
        }

        // call login request 
        const loginValues = {
            email: loginInfo.email.value,
            password: loginInfo.password.value
        }
        loginMutation.mutate(loginValues);
    }


    return (
        <form onSubmit={submitLoginHandler} className="flex flex-col gap-5 bg-white py-7 px-3 rounded shadow-sm" noValidate>
            <InputContainer onChange={onChangeEmail} value={loginInfo.email.value} isError={isSubmitted && loginInfo.email.isError} errorMsg={loginInfo.email.error} name="email" label="Email" placeholder="Email address" type="email" requiredSign={false} />
            <InputContainer onChange={onChangePassword} value={loginInfo.password.value} isError={isSubmitted && loginInfo.password.isError} errorMsg={loginInfo.password.error} name="password" label="Password" placeholder="Password" type="password" requiredSign={false} />
            <div className='flex flex-col gap-2'>
                <Link to={"/auth/forget-password"} className='self-start text-sm font-medium text-purple-600'>Forgotten Password?</Link>
                <PrimaryButton style='solid' disabled={loginMutation.isLoading} type="submit" fullWith={true} justifyConent="center" x="md" y="lg">
                    Login
                    <BiArrowBack className="rotate-[135deg]" />
                </PrimaryButton>
            </div>
            <button onClick={quickAccessToggle} type='button' className="self-start text-slate-700 font-medium flex items-center gap-2">
                Quick Access
                <BiArrowBack className={`duration-200 ${isQuickAccessOpen ? "rotate-90" : "-rotate-90"}`} />
            </button>
            {isQuickAccessOpen ?
                <QuickAccess />
                :
                null
            }
        </form>
    )
}

export default LoginForm