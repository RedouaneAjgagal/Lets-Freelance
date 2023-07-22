import { BiArrowBack } from "react-icons/bi";
import { PrimaryButton } from "../../../layouts/brand";
import SelectInputContainer from "./SelectInputContainer";
import { useState } from "react";
import useOverflow from "../../../hooks/useOverflow";
import Model from "../../../layouts/Model";
import EditSection from "./EditSection";

const role: "freelancer" | "employer" = "freelancer";

const AccountForm = () => {
    const [isDeleteModel, setIsDeleteModel] = useState(false);


    const updateAccountHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(true);
    }

    const openDeleteModel = () => {
        setIsDeleteModel(true);
    }

    const closeDeleteModel = () => {
        setIsDeleteModel(false);
    }

    const deleteAccountHandler = () => {
        console.log("account deleted!");
    }

    useOverflow(isDeleteModel);

    return (
        <div className="flex flex-col gap-12 mb-4">
            <EditSection title="Account Settings" titleColor="black" bgTransparent withoutPadding>
                <form onSubmit={updateAccountHandler} className="flex flex-col gap-3">
                    <SelectInputContainer label="Switch Profile" name="switchProfile" options={["Freelancer", "Employer"]} defaultValue={role === "freelancer" ? "Freelancer" : "Employer"} />
                    <PrimaryButton disabled={false} fullWith={false} justifyConent="start" type="submit" x="md" y="md">Update Account <BiArrowBack className="rotate-[135deg]" size="1.1rem" /></PrimaryButton>
                </form>
            </EditSection>
            <EditSection title="Delete Account" titleColor="red" bgTransparent withoutPadding>
                <div className="flex flex-col gap-3">
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                    <button onClick={openDeleteModel} className="self-start bg-slate-100 border border-slate-300 p-[0.35rem] text-red-600 font-medium rounded">Delete My Account</button>
                </div>
            </EditSection>
            {isDeleteModel ?
                <Model onConfirm={deleteAccountHandler} onClose={closeDeleteModel} title="Account deletion" desc="Are you sure you want to delete your account?" confirmBtnContent="Delete Account" cancelBtnContent="Cancel" color="red" />
                :
                null
            }
        </div>
    )
}

export default AccountForm