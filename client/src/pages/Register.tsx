import { Link, Navigate } from "react-router-dom"
import { RegisterForm } from "../features/auth"
import { useAppSelector } from "../hooks/redux";

const Register = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    return (
        userInfo ? <Navigate to="/profile/settings" />
            :
            <main className="flex flex-col gap-8 px-2 pt-8 pb-20 md:px-8 xl:mx-4 xl:px-0 md:items-center">
                <article className="text-center flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Register</h1>
                    <p className="text-slate-600 leading-[1.6]">Join us now, hundreds of Freelancers & Employees right now on Lets Freelance</p>
                </article>
                <div className="flex flex-col gap-4 md:min-w-[50rem] md:max-w-[50rem]">
                    <RegisterForm />
                    <p className="text-slate-600 text-center">Already have an account? <Link to="/auth/login" className="text-purple-600 font-medium">Log In</Link></p>
                </div>
            </main>
    )
}

export default Register