import InputContainer from './InputContainer'
import { PrimaryButton } from '../../../layouts/brand'
import { BiArrowBack } from 'react-icons/bi'

const ResetPasswordForm = () => {
    return (
        <form className="flex flex-col gap-5 bg-white py-7 px-3 rounded shadow-sm" noValidate>
            <InputContainer name="password" label="New Password" placeholder="Password" type="password" requiredSign={false} />
            <InputContainer name="repeatedPassword" label="Repeat New Password" placeholder="Password" type="password" requiredSign={false} />
            <PrimaryButton type="submit" fullWith={true} justifyConent="center" x="md" y="lg">
                Reset Password
                <BiArrowBack className="rotate-[135deg]" />
            </PrimaryButton>
        </form>
    )
}

export default ResetPasswordForm