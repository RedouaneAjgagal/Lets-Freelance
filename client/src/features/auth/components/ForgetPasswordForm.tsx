import InputContainer from './InputContainer'
import { PrimaryButton } from '../../../layouts/brand'
import { BiArrowBack } from 'react-icons/bi'
import { useState } from "react";
import { useAppSelector } from '../../../hooks/redux';
import useForgetPasswordMutation from '../hooks/useForgetPasswordMutation';

const ForgetPasswordForm = () => {
    const { email } = useAppSelector(state => state.forgetPasswordReducer);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const forgetPasswordMutation = useForgetPasswordMutation();

    const forgetPassowrdSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);

        // check if valid values
        if (email.error.isError) {
            return;
        }

        // call forget password request
        const forgetPasswordValues = {
            email: email.value
        }
        forgetPasswordMutation.mutate(forgetPasswordValues);
    }

    return (
        <>
            {forgetPasswordMutation.isSuccess ?
                <div className='px-3 py-7 text-center rounded bg-green-100 text-green-700'><p>{forgetPasswordMutation.data.data.msg}</p></div>
                :
                <form onSubmit={forgetPassowrdSubmitHandler} className="flex flex-col gap-5 bg-white py-7 px-3 rounded shadow-sm" noValidate>
                    <InputContainer form="forgetPassword" error={isSubmitted ? { isError: email.error.isError, reason: email.error.reason } : { isError: false, reason: "" }} name="email" label="Email" placeholder="Email address" type="email" for="email" requiredSign={false} />
                    <PrimaryButton disabled={forgetPasswordMutation.isLoading} type="submit" fullWith={true} justifyConent="center" x="md" y="lg">
                        Get New Password
                        <BiArrowBack className="rotate-[135deg]" />
                    </PrimaryButton>
                </form>
            }
        </>
    )
}

export default ForgetPasswordForm