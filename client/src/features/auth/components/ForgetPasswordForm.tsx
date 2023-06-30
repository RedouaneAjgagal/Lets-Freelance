import InputContainer from './InputContainer'
import { PrimaryButton } from '../../../layouts/brand'
import { BiArrowBack } from 'react-icons/bi'

const ForgetPasswordForm = () => {
    return (
        <form className="flex flex-col gap-5 bg-white py-7 px-3 rounded shadow-sm" noValidate>
            <InputContainer name="email" label="Email" placeholder="Email address" type="email" requiredSign={false} />
            <PrimaryButton type="submit" fullWith={true} justifyConent="center" x="md" y="lg">
                Get New Password
                <BiArrowBack className="rotate-[135deg]" />
            </PrimaryButton>
        </form>
    )
}

export default ForgetPasswordForm