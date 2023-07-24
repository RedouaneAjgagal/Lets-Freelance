import React, { useState } from 'react'
import EditSection from './EditSection'
import InputContainer from './InputContainer'
import { PrimaryButton } from '../../../layouts/brand';
import emailValidation from '../../../validators/emailValidation';
import Toaster from 'react-hot-toast';
import useResetEmailMutation from '../hooks/useResetEmailMutation';
import { useSearchParams } from 'react-router-dom';

type SetInput = {
    value: string;
    key: "newEmail" | "repeatNewEmail";
    validation: {
        isError: boolean;
        reason: string;
    }
}

const ResetEmailForm = () => {
    const resetEmailMutation = useResetEmailMutation();
    const [searchParams] = useSearchParams();


    const [isSubmitted, setIsSubmitted] = useState(false);
    const [resetEmailInfo, setResetEmailInfo] = useState({
        newEmail:
            { value: "", isError: true, error: "please provide an email" },
        repeatNewEmail:
            { value: "", isError: true, error: "please provide an email" }
    });

    const setInput = ({ value, key, validation }: SetInput) => {
        setResetEmailInfo(prev => {
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


    const newEmailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const validation = emailValidation(e.currentTarget.value);
        setInput({ key: "newEmail", value: e.currentTarget.value, validation });
    }

    const repeatNewEmailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const validation = emailValidation(e.currentTarget.value);
        setInput({ key: "repeatNewEmail", value: e.currentTarget.value, validation });
    }


    // Update email
    const resetEmailhandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);
        const isInvalidEmail = Object.values(resetEmailInfo).some(key => key.isError);
        if (isInvalidEmail) return;
        if (resetEmailInfo.newEmail.value !== resetEmailInfo.repeatNewEmail.value) {
            Toaster.error("Emails doesn't match", { id: "resetEmailError", duration: 2000 });
            return
        }
        const token = searchParams.get("token");
        if (!token) {
            Toaster.error("Verification failed", { id: "resetEmailError", duration: 2000 });
            return
        }
        resetEmailMutation.mutate({
            newEmail: resetEmailInfo.newEmail.value,
            token
        })
        console.log("email changed");
    }

    return (
        <EditSection title="Reset Email" titleColor="black">
            <form onSubmit={resetEmailhandler} noValidate className="flex flex-col gap-6">
                <InputContainer onChange={newEmailOnChange} value={resetEmailInfo.newEmail.value} label="New email" name="newEmail" type="email" isError={isSubmitted && resetEmailInfo.newEmail.isError} errorMsg={resetEmailInfo.newEmail.error} />
                <InputContainer onChange={repeatNewEmailOnChange} value={resetEmailInfo.repeatNewEmail.value} label="Repeat new email" name="repeatNewEmail" type="email" isError={isSubmitted && resetEmailInfo.repeatNewEmail.isError} errorMsg={resetEmailInfo.repeatNewEmail.error} />
                <PrimaryButton type="submit" x="md" y="md" fullWith={false} justifyConent="start" disabled={false}>Update Email</PrimaryButton>
            </form>
        </EditSection>
    )
}

export default ResetEmailForm