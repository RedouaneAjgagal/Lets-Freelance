import { Navigate } from "react-router-dom";
import { ResetEmailForm } from "../../features/profile";
import { useAppSelector } from "../../hooks/redux";

const ResetEmail = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    return (
        userInfo ?
            <main className="p-4 bg-purple-100/30 grid gap-4">
                <h1 className="text-3xl font-semibold text-purple-800 leading-[1.3]">Edit profile</h1>
                <ResetEmailForm />
            </main>
            :
            <Navigate to="/auth/login" />
    )
}

export default ResetEmail