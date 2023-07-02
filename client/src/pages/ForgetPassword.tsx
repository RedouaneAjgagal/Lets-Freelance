import { Link } from 'react-router-dom'
import ForgetPasswordForm from '../features/auth/components/ForgetPasswordForm'

const ForgetPassword = () => {
    return (
        <main className="flex flex-col gap-8 px-2 pt-8 pb-20 bg-purple-100/50">
            <article className="text-center flex flex-col gap-2">
                <h1 className="text-3xl font-semibold">Reset Password</h1>
                <p className="text-slate-600 leading-[1.6]">Get back your password by entering your email</p>
            </article>
            <div className="flex flex-col gap-4">
                <ForgetPasswordForm />
                <Link to="/auth/login" className="self-center underline text-slate-600 font-medium text-center">Back To Login</Link>
            </div>
        </main>
    )
}

export default ForgetPassword