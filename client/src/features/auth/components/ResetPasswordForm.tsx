import InputContainer from './InputContainer'
import { PrimaryButton } from '../../../layouts/brand'
import { BiArrowBack } from 'react-icons/bi'
import { useState } from 'react'
import { useAppSelector } from '../../../hooks/redux'
import toast from "react-hot-toast";
import useResetPasswordMutation from '../hooks/useResetPasswordMutation'
import { useSearchParams } from 'react-router-dom'

const ResetPasswordForm = () => {
    const { newPassword, repeatNewPassword } = useAppSelector(state => state.resetPasswordReducer);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const resetPasswordMutation = useResetPasswordMutation();
    const [searchParams] = useSearchParams();
    const resetPasswordSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);

        // check if valid values
        if (newPassword.error.isError || repeatNewPassword.error.isError) {
            return
        }
        if (newPassword.value !== repeatNewPassword.value) {
            toast.error("Passwords doesnt match");
            return;
        }
        const getTokenQuery = searchParams.get("token");
        const getEmailQuery = searchParams.get("email");
        if (!getTokenQuery || !getEmailQuery) {
            toast.error("Invalid Credentials");
            return;
        }

        // Call reset password request
        const resetPasswordValues = {
            token: getTokenQuery,
            email: getEmailQuery,
            newPassword: newPassword.value,
            repeatNewPassword: repeatNewPassword.value
        }
        resetPasswordMutation.mutate(resetPasswordValues)
    }

    return (
        <form onSubmit={resetPasswordSubmitHandler} className="flex flex-col gap-5 bg-white py-7 px-3 rounded shadow-sm" noValidate>
            <InputContainer form='resetPassword' name="password" label="New Password" placeholder="Password" type="password" for="password" error={isSubmitted ? { isError: newPassword.error.isError, reason: newPassword.error.reason } : { isError: false, reason: "" }} requiredSign={false} />
            <InputContainer form='resetPassword' name="repeatedPassword" label="Repeat New Password" placeholder="Password" type="password" for="password" error={isSubmitted ? { isError: repeatNewPassword.error.isError, reason: repeatNewPassword.error.reason } : { isError: false, reason: "" }} requiredSign={false} />
            <PrimaryButton disabled={resetPasswordMutation.isLoading} type="submit" fullWith={true} justifyConent="center" x="md" y="lg">
                Reset Password
                <BiArrowBack className="rotate-[135deg]" />
            </PrimaryButton>
        </form>
    )
}

export default ResetPasswordForm