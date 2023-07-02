import InputContainer from './InputContainer'
import { PrimaryButton } from '../../../layouts/brand'
import { BiArrowBack } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { useState } from "react";
import QuickAccess from './QuickAccess';
import { useAppSelector } from '../../../hooks/redux';
import useLoginMutation from '../hooks/useLoginMutation';

const LoginForm = () => {
    const { email, password } = useAppSelector(state => state.loginReducer);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);

    const quickAccessToggle = () => {
        setIsQuickAccessOpen(prevState => !prevState);
    }

    const loginMutation = useLoginMutation();

    const submitLoginHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);

        // check if valid values
        if (email.error.isError || password.error.isError) {
            return;
        }

        // call login request 
        const loginValues = {
            email: email.value,
            password: password.value
        }
        loginMutation.mutate(loginValues);
    }

    return (
        <form onSubmit={submitLoginHandler} className="flex flex-col gap-5 bg-white py-7 px-3 rounded shadow-sm" noValidate>
            <InputContainer form="login" name="email" label="Email" placeholder="Email address" type="email" for="email" error={isSubmitted ? { isError: email.error.isError, reason: email.error.reason } : { isError: false, reason: "" }} requiredSign={false} />
            <InputContainer form="login" name="password" label="Password" placeholder="Password" type="password" for="password" error={isSubmitted ? { isError: password.error.isError, reason: password.error.reason } : { isError: false, reason: "" }} requiredSign={false} />
            <div className='flex flex-col gap-2'>
                <Link to={"/auth/forget-password"} className='self-start text-sm font-medium text-purple-600'>Forgotten Password?</Link>
                <PrimaryButton disabled={loginMutation.isLoading} type="submit" fullWith={true} justifyConent="center" x="md" y="lg">
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