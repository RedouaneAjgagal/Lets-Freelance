import { useEffect, useState } from "react";
import { UserBankAccountsResponse, useAddExtertaBankAccountMutation, useDeleteBankAccountMutation } from "../../auth"
import FreelancerBankAccount from "./FreelancerBankAccount";
import ActionModal from "../../../layouts/ActionModal";
import FreelancerBankAccountForm from "./FreelancerBankAccountForm";

type FreelancerBankAccountsProps = {
    bankAccountDetails: UserBankAccountsResponse
}

const FreelancerBankAccounts = (props: React.PropsWithoutRef<FreelancerBankAccountsProps>) => {
    const [isDeleteBankAccountOpen, setIsDeleteBankAccountOpen] = useState(false);
    const [isExternalBankAccountOpen, setIsExternalBankAccountOpen] = useState(false);

    const closeExternalFormHandler = () => {
        setIsExternalBankAccountOpen(false);
    }

    const deleteBankAccountMutation = useDeleteBankAccountMutation();

    const addExtertaBankAccountMutation = useAddExtertaBankAccountMutation({
        onClose: closeExternalFormHandler
    });

    const deleteBankAccountsHandler = () => {
        if (deleteBankAccountMutation.isLoading) return;
        deleteBankAccountMutation.mutate();
    }

    const bankAccounts = props.bankAccountDetails.bankAccounts.map(bankAccount => {
        const isDefaultCurrency = bankAccount.isDefault
            && bankAccount.currency === props.bankAccountDetails.defaultCurrency;

        const currenciesSet = new Set(props.bankAccountDetails.bankAccounts
            .filter(bankAccount => bankAccount.currency !== props.bankAccountDetails.defaultCurrency)
            .map(bankAccount => bankAccount.currency)
        );

        const currencies = Array.from(currenciesSet);

        return (
            <FreelancerBankAccount key={bankAccount._id} bankAccount={bankAccount} isDefaultCurrency={isDefaultCurrency} currencies={currencies} />
        )
    });

    useEffect(() => {
        if (deleteBankAccountMutation.isSuccess) {
            setIsDeleteBankAccountOpen(false);
        }
    }, [deleteBankAccountMutation.isSuccess]);

    return (
        <>
            <div className="mb-4">
                <button onClick={() => setIsDeleteBankAccountOpen(true)} className="self-start border bg-slate-200/50 px-2 py-1 text-red-600 font-medium rounded">Delete all my bank accounts</button>
                {isDeleteBankAccountOpen ?
                    <ActionModal cancelBtnContent="Cancel" color="red" confirmBtnContent="Delete" desc="Are you sure you want to delete your bank accounts? This action can't be undone" disabled={deleteBankAccountMutation.isLoading} onClose={() => setIsDeleteBankAccountOpen(false)} onConfirm={deleteBankAccountsHandler} title="Delete all of my bank accounts" isLoading={deleteBankAccountMutation.isLoading} />
                    : null
                }
            </div>
            <ul className="bg-slate-200/50 border rounded">
                {bankAccounts}
            </ul>
            <div className="mt-4">
                {isExternalBankAccountOpen ?
                    <FreelancerBankAccountForm externalAccountOnly onClose={closeExternalFormHandler} submit={addExtertaBankAccountMutation} />
                    : <button onClick={() => setIsExternalBankAccountOpen(true)} className="self-start border bg-blue-100/80 px-2 py-1 text-blue-500 font-medium rounded">Add an external bank account</button>
                }
            </div>
        </>
    )
}

export default FreelancerBankAccounts