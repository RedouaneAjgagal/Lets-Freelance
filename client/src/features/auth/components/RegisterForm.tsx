import { useState } from "react";
import RoleButton from "./RoleButton";
import { BiArrowBack } from "react-icons/bi";
import { PrimaryButton } from "../../../layouts/brand";
import InputContainer from "./InputContainer";
const RegisterForm = () => {
    const [userAs, setUserAs] = useState<"Freelancer" | "Employee">("Freelancer");

    const selectRoleHandler = (role: "Freelancer" | "Employee") => {
        setUserAs(role);
    }

    return (
        <form className="flex flex-col gap-5 bg-white py-7 px-3 rounded shadow-sm">
            <div className="flex items-center justify-center gap-2">
                <RoleButton value="Freelancer" role={userAs} onSelectRole={selectRoleHandler} />
                <RoleButton value="Employee" role={userAs} onSelectRole={selectRoleHandler} />
            </div>
            <InputContainer name="name" label="Name" placeholder="User name" type="text" requiredSign />
            <InputContainer name="email" label="Email" placeholder="Email address" type="email" requiredSign />
            <InputContainer name="password" label="Password" placeholder="Password" type="password" requiredSign />
            <PrimaryButton type="submit" fullWith={true} justifyConent="center" x="md" y="lg">Register Now <BiArrowBack className="rotate-[135deg]" /></PrimaryButton>
        </form>
    )
}

export default RegisterForm