import InputContainer from './InputContainer'
import { PrimaryButton } from '../../../layouts/brand'
import { BiArrowBack } from 'react-icons/bi'
import { useState } from "react";
import useForgetPasswordMutation from '../hooks/useForgetPasswordMutation';
import { emailValidation } from '../validators/inputValidations';

type SetInput = {
    value: string;
    key: "email";
    validation: {
        isError: boolean;
        reason: string;
    }
}

const ForgetPasswordForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [forgetPasswordInfo, setForgetPasswordinfo] = useState({
        email: {
            value: "",
            isError: true,
            error: "Please provide an email"
        }
    })
    const forgetPasswordMutation = useForgetPasswordMutation();

    const setInput = ({ value, key, validation }: SetInput) => {
        setForgetPasswordinfo(prev => {
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

    const onChangeEmail = (value: string) => {
        const validation = emailValidation(value);
        setInput({ value, key: "email", validation });
    }

    const forgetPassowrdSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);

        // check if valid values
        if (forgetPasswordInfo.email.isError) {
            return;
        }

        // call forget password request
        const forgetPasswordValues = {
            email: forgetPasswordInfo.email.value
        }
        forgetPasswordMutation.mutate(forgetPasswordValues);
    }

    return (
        <>
            {forgetPasswordMutation.isSuccess ?
                <div className='px-3 py-7 text-center rounded bg-green-100 text-green-700'><p>{forgetPasswordMutation.data.data.msg}</p></div>
                :
                <form onSubmit={forgetPassowrdSubmitHandler} className="flex flex-col gap-5 bg-white py-7 px-3 rounded shadow-sm" noValidate>
                    <InputContainer onChange={onChangeEmail} isError={isSubmitted && forgetPasswordInfo.email.isError} errorMsg={forgetPasswordInfo.email.error} value={forgetPasswordInfo.email.value} name="email" label="Email" placeholder="Email address" type="email" requiredSign={false} />
                    <PrimaryButton style='solid' disabled={forgetPasswordMutation.isLoading} type="submit" fullWith={true} justifyConent="center" x="md" y="lg">
                        Get New Password
                        <BiArrowBack className="rotate-[135deg]" />
                    </PrimaryButton>
                </form>
            }
        </>
    )
}

export default ForgetPasswordForm