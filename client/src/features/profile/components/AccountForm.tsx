import { useState } from "react";
import useOverflow from "../../../hooks/useOverflow";
import ActionModal from "../../../layouts/ActionModal";
import EditSection from "./EditSection";
import useDeleteAccountMutation from "../hooks/useDeleteAccountMutation";
import FreelancerBankAccountContainer from "./FreelancerBankAccountContainer";
import { useAppSelector } from "../../../hooks/redux";

const AccountForm = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const deleteAccountMutation = useDeleteAccountMutation();
    const [isDeleteModel, setIsDeleteModel] = useState(false);


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
            {userInfo?.userAs === "freelancer" ?
                <EditSection title="Bank Accounts" titleColor="black" bgTransparent withoutPadding>
                    <FreelancerBankAccountContainer />
                </EditSection>
                : null
            }
            <EditSection title="Delete Account" titleColor="red" bgTransparent withoutPadding>
                <div className="flex flex-col gap-3">
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                    <button onClick={openDeleteModel} className="self-start bg-slate-100 border border-slate-300 p-[0.35rem] text-red-600 font-medium rounded">Delete My Account</button>
                </div>
            </EditSection>
            {isDeleteModel ?
                <ActionModal onConfirm={deleteAccountHandler} onClose={closeDeleteModel} disabled={deleteAccountMutation.isLoading} title="Account deletion" desc="Are you sure you want to delete your account?" confirmBtnContent="Delete Account" cancelBtnContent="Cancel" color="red" isLoading={deleteAccountMutation.isLoading} />
                :
                null
            }
        </div>
    )
}

export default AccountForm