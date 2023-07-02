import { useState } from "react";
import RoleButton from "./RoleButton";
import { BiArrowBack } from "react-icons/bi";
import { PrimaryButton } from "../../../layouts/brand";
import InputContainer from "./InputContainer";
import useRegisterMutation from "../hooks/useRegisterMutation";
import { emailValidation, nameValidation, passwordValidation } from "../validators/inputValidations";

type SetInput = {
    value: string;
    key: "name" | "email" | "password";
    validation: {
        isError: boolean;
        reason: string;
    }
}

const RegisterForm = () => {
    const [registerInfo, setRegisterInfo] = useState({
        name: {
            value: "",
            isError: true,
            error: "Please provide a name"
        },
        email: {
            value: "",
            isError: true,
            error: "Please provide an email"
        },
        password: {
            value: "",
            isError: true,
            error: "Please provide a password"
        },
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [userAs, setUserAs] = useState<"Freelancer" | "Employee">("Freelancer");


    const setInput = ({ value, key, validation }: SetInput) => {
        setRegisterInfo(prev => {
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

    const onChangeName = (value: string) => {
        const validation = nameValidation(value);
        setInput({ validation, key: "name", value });
    }

    const onChangeEmail = (value: string) => {
        const validation = emailValidation(value);
        setInput({ validation, key: "email", value });
    }

    const onChangePassword = (value: string) => {
        const validation = passwordValidation(value);
        setInput({ validation, key: "password", value });
    }

    const selectRoleHandler = (role: "Freelancer" | "Employee") => {
        setUserAs(role);
    }

    const registerMutation = useRegisterMutation();

    // Submit register form
    const submitRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);


        // check if valid values
        if (registerInfo.name.isError || registerInfo.email.isError || registerInfo.password.isError || (userAs !== "Freelancer" && userAs !== "Employee")) {
            return;
        }

        // call register request
        const role = userAs.toLowerCase() as "freelancer" | "employee";
        const registerValues = {
            name: registerInfo.name.value,
            email: registerInfo.email.value,
            password: registerInfo.password.value,
            userAs: role
        }
        registerMutation.mutate(registerValues);
    }

    return (
        <form onSubmit={submitRegister} className="flex flex-col gap-9 bg-white py-7 px-3 rounded shadow-sm" noValidate>
            <div className="flex items-center justify-center gap-2">
                <RoleButton value="Freelancer" role={userAs} onSelectRole={selectRoleHandler} />
                <RoleButton value="Employee" role={userAs} onSelectRole={selectRoleHandler} />
            </div>
            <div className="flex flex-col gap-6">
                <InputContainer onChange={onChangeName} isError={isSubmitted && registerInfo.name.isError} errorMsg={registerInfo.name.error} value={registerInfo.name.value} name="name" label="Name" placeholder="User name" type="text" requiredSign />
                <InputContainer onChange={onChangeEmail} isError={isSubmitted && registerInfo.email.isError} errorMsg={registerInfo.email.error} value={registerInfo.email.value} name="email" label="Email" placeholder="Email address" type="email" requiredSign />
                <InputContainer onChange={onChangePassword} isError={isSubmitted && registerInfo.password.isError} errorMsg={registerInfo.password.error} value={registerInfo.password.value} name="password" label="Password" placeholder="Password" type="password" requiredSign />
            </div>
            <PrimaryButton disabled={registerMutation.isLoading} type="submit" fullWith={true} justifyConent="center" x="md" y="lg">
                Register Now
                <BiArrowBack className="rotate-[135deg]" />
            </PrimaryButton>
        </form>
    )
}

export default RegisterForm