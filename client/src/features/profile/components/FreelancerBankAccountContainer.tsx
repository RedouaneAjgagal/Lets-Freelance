import Loading from "../../../components/Loading";
import { useSetBankAccountMutation, useUserBankAccountsQuery } from "../../auth"
import FreelancerBankAccountForm from "./FreelancerBankAccountForm";
import FreelancerBankAccounts from "./FreelancerBankAccounts";


const FreelancerBankAccountContainer = () => {
    const setBankAccountMutation = useSetBankAccountMutation();

    const bankAccountsQuery = useUserBankAccountsQuery({
        fetchBankAccounts: true
    });

    return (
        bankAccountsQuery!.isLoading ?
            <Loading />
            : <div>
                {bankAccountsQuery!.data?.bankAccounts.length ?
                    <FreelancerBankAccounts bankAccountDetails={bankAccountsQuery!.data} />
                    : <FreelancerBankAccountForm externalAccountOnly={false} submit={setBankAccountMutation} />
                }
            </div>
    )
}

export default FreelancerBankAccountContainer