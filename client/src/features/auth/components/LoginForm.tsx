import InputContainer from './InputContainer'
import { PrimaryButton } from '../../../layouts/brand'
import { BiArrowBack } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { useState } from "react";
import QuickAccess from './QuickAccess';

const LoginForm = () => {
    const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);
    const quickAccessToggle = () => {
        setIsQuickAccessOpen(prevState => !prevState);
    }
    return (
        <form className="flex flex-col gap-5 bg-white py-7 px-3 rounded shadow-sm" noValidate>
            <InputContainer name="email" label="Email" placeholder="Email address" type="email" requiredSign={false} />
            <InputContainer name="password" label="Password" placeholder="Password" type="password" requiredSign={false} />
            <PrimaryButton type="submit" fullWith={true} justifyConent="center" x="md" y="lg">
                Login
                <BiArrowBack className="rotate-[135deg]" />
            </PrimaryButton>
            <p className="text-slate-600">Don't have an account? <Link to="/auth/register" className="text-purple-600 font-medium">Register</Link></p>
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