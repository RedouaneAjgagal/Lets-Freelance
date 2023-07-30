import { BiArrowBack } from "react-icons/bi";
import { PrimaryButton } from "../../../layouts/brand";
import SelectInputContainer from "./SelectInputContainer";
import { useState } from "react";
import useOverflow from "../../../hooks/useOverflow";
import Model from "../../../layouts/Model";
import EditSection from "./EditSection";
import useDeleteAccountMutation from "../hooks/useDeleteAccountMutation";
import useSwitchProfileMutation from "../hooks/useSwitchProfileMutation";


interface Props {
    role: "freelancer" | "employer";
}

const AccountForm = (props: React.PropsWithoutRef<Props>) => {
    const deleteAccountMutation = useDeleteAccountMutation();
    const switchProfileMutation = useSwitchProfileMutation();
    const [isDeleteModel, setIsDeleteModel] = useState(false);
    const [switchedRole, setSwitchedRole] = useState<"freelancer" | "employer">(props.role);

    const switchProfileHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRole = e.currentTarget.value.toLowerCase() as "freelancer" | "employer";
        setSwitchedRole(selectedRole);
    }

    const updateAccountHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!switchedRole || (switchedRole !== "freelancer" && switchedRole !== "employer")) {
            return;
        }
        switchProfileMutation.mutate(switchedRole);
    }


    const openDeleteModel = () => {
        setIsDeleteModel(true);
    }

    const closeDeleteModel = () => {
        setIsDeleteModel(false);
    }

    const deleteAccountHandler = () => {
        deleteAccountMutation.mutate();
    }

    useOverflow(isDeleteModel);

    return (
        <div className="flex flex-col gap-12 mb-4">
            <EditSection title="Account Settings" titleColor="black" bgTransparent withoutPadding>
                <form onSubmit={updateAccountHandler} className="flex flex-col gap-3">
                    <SelectInputContainer onChange={switchProfileHandler} label="Switch Profile" name="switchProfile" options={["Freelancer", "Employer"]} value={switchedRole} isError={false} error="" />
                    <PrimaryButton disabled={switchProfileMutation.isLoading} fullWith={false} justifyConent="start" type="submit" x="md" y="md">Update Account <BiArrowBack className="rotate-[135deg]" size="1.1rem" /></PrimaryButton>
                </form>
            </EditSection>
            <EditSection title="Delete Account" titleColor="red" bgTransparent withoutPadding>
                <div className="flex flex-col gap-3">
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                    <button onClick={openDeleteModel} className="self-start bg-slate-100 border border-slate-300 p-[0.35rem] text-red-600 font-medium rounded">Delete My Account</button>
                </div>
            </EditSection>
            {isDeleteModel ?
                <Model onConfirm={deleteAccountHandler} onClose={closeDeleteModel} disabled={deleteAccountMutation.isLoading} title="Account deletion" desc="Are you sure you want to delete your account?" confirmBtnContent="Delete Account" cancelBtnContent="Cancel" color="red" />
                :
                null
            }
        </div>
    )
}

export default AccountForm