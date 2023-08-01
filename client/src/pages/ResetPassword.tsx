import { Navigate } from 'react-router-dom';
import ResetPasswordForm from '../features/auth/components/ResetPasswordForm'
import { useAppSelector } from '../hooks/redux';

const ResetPassword = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    return (
        userInfo ? <Navigate to="/profile/settings" />
            :
            <main className="flex flex-col gap-8 px-2 pt-8 pb-20 bg-purple-100/50">
                <article className="text-center flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Reset Password</h1>
                    <p className="text-slate-600 leading-[1.6]">Let's create a new passowrd for your account</p>
                </article>
                <ResetPasswordForm />
            </main>
    )
}

export default ResetPassword