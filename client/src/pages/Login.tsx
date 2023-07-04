import { Link } from "react-router-dom"
import { LoginForm } from "../features/auth"
import AuthRedirection from '../helpers/AuthRedirection'

const Login = () => {
    return (
        <>
            <AuthRedirection />
            <main className="flex flex-col gap-8 px-2 pt-8 pb-20 bg-purple-100/50">
                <article className="text-center flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Login</h1>
                    <p className="text-slate-600 leading-[1.6]">Gain access to a vibrant community of freelancers and employees</p>
                </article>
                <div className="flex flex-col gap-4">
                    <LoginForm />
                    <p className="text-slate-600 text-center">Don't have an account? <Link to="/auth/register" className="text-purple-600 font-medium">Register</Link></p>
                </div>
            </main>
        </>

    )
}

export default Login