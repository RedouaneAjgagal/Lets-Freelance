import InputContainer from './InputContainer'
import { PrimaryButton } from '../../../layouts/brand'
import { BiArrowBack } from 'react-icons/bi'
import { useState } from 'react'
import toast from "react-hot-toast";
import useResetPasswordMutation from '../hooks/useResetPasswordMutation'
import { useSearchParams } from 'react-router-dom'
import { passwordValidation } from '../validators/inputValidations'

type SetInput = {
    value: string;
    key: "newPassword" | "repeatNewPassword";
    validation: {
        isError: boolean;
        reason: string;
    }
}

const ResetPasswordForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const resetPasswordMutation = useResetPasswordMutation();
    const [searchParams] = useSearchParams();

    const [resetPasswordInfo, setResetPasswordInfo] = useState({
        newPassword: {
            value: "",
            isError: true,
            error: "Please provide a password"
        },
        repeatNewPassword: {
            value: "",
            isError: true,
            error: "Please provide a password"
        }
    })

    const setInput = ({ value, key, validation }: SetInput) => {
        setResetPasswordInfo(prev => {
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

    const onChangeNewPassword = (value: string) => {
        const validation = passwordValidation(value);
        setInput({ value, key: "newPassword", validation });
    }
    const onChangeRepeatNewPassword = (value: string) => {
        const validation = passwordValidation(value);
        setInput({ value, key: "repeatNewPassword", validation });
    }

    const resetPasswordSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);

        // check if valid values
        if (resetPasswordInfo.newPassword.isError || resetPasswordInfo.repeatNewPassword.isError) {
            return
        }
        if (resetPasswordInfo.newPassword.value !== resetPasswordInfo.repeatNewPassword.value) {
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
            newPassword: resetPasswordInfo.newPassword.value,
            repeatNewPassword: resetPasswordInfo.repeatNewPassword.value
        }
        resetPasswordMutation.mutate(resetPasswordValues);
    }

    return (
        <form onSubmit={resetPasswordSubmitHandler} className="flex flex-col gap-5 bg-white py-7 px-3 rounded shadow-sm" noValidate>
            <InputContainer onChange={onChangeNewPassword} isError={isSubmitted && resetPasswordInfo.newPassword.isError} errorMsg={resetPasswordInfo.newPassword.error} value={resetPasswordInfo.newPassword.value} name="password" label="New Password" placeholder="Password" type="password" requiredSign={false} />
            <InputContainer onChange={onChangeRepeatNewPassword} isError={isSubmitted && resetPasswordInfo.repeatNewPassword.isError} errorMsg={resetPasswordInfo.repeatNewPassword.error} value={resetPasswordInfo.repeatNewPassword.value} name="repeatedPassword" label="Repeat New Password" placeholder="Password" type="password" requiredSign={false} />
            <PrimaryButton style='solid' disabled={resetPasswordMutation.isLoading} type="submit" fullWith={true} justifyConent="center" x="md" y="lg">
                Reset Password
                <BiArrowBack className="rotate-[135deg]" />
            </PrimaryButton>
        </form>
    )
}

export default ResetPasswordForm