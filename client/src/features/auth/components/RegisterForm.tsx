import { useState } from "react";
import RoleButton from "./RoleButton";
import { BiArrowBack } from "react-icons/bi";
import { PrimaryButton } from "../../../layouts/brand";
import InputContainer from "./InputContainer";
import { useAppSelector } from "../../../hooks/redux";
import registerRequest from "../services/register";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";


const RegisterForm = () => {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [userAs, setUserAs] = useState<"Freelancer" | "Employee">("Freelancer");
    const { name, email, password } = useAppSelector(state => state.registerReducer);

    const selectRoleHandler = (role: "Freelancer" | "Employee") => {
        setUserAs(role);
    }

    // On register request
    const registerMutation = useMutation({
        mutationFn: registerRequest,
        onSuccess: ({ data }) => {
            toast.success(data.msg, { duration: 4000 });
            navigate("/auth/login");
        },
        onError: (error: AxiosError<{ msg: string }>) => {
            const errorMsg = error.response?.data.msg || "Something went wrong!";
            toast.error(errorMsg);
        }
    });


    // Submit register form
    const submitRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);

        // check if valid values
        if (name.error.isError || email.error.isError || password.error.isError || (userAs !== "Freelancer" && userAs !== "Employee")) {
            return;
        }

        // call register request
        const role = userAs.toLowerCase() as "freelancer" | "employee";
        const registerValues = {
            name: name.value,
            email: email.value,
            password: password.value,
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
                <InputContainer form="register" name="name" label="Name" placeholder="User name" type="text" for="name" error={isSubmitted ? { isError: name.error.isError, reason: name.error.reason } : { isError: false, reason: "" }} requiredSign />
                <InputContainer form="register" name="email" label="Email" placeholder="Email address" type="email" for="email" error={isSubmitted ? { isError: email.error.isError, reason: email.error.reason } : { isError: false, reason: "" }} requiredSign />
                <InputContainer form="register" name="password" label="Password" placeholder="Password" type="password" for="password" error={isSubmitted ? { isError: password.error.isError, reason: password.error.reason } : { isError: false, reason: "" }} requiredSign />
            </div>
            <PrimaryButton isLoading={registerMutation.isLoading} type="submit" fullWith={true} justifyConent="center" x="md" y="lg">
                Register Now
                <BiArrowBack className="rotate-[135deg]" />
            </PrimaryButton>
        </form>
    )
}

export default RegisterForm