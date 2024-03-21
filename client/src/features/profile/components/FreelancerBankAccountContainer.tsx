import Loading from "../../../components/Loading";
import { useUserBankAccountsQuery } from "../../auth"
import FreelancerBankAccountForm from "./FreelancerBankAccountForm";
import FreelancerBankAccounts from "./FreelancerBankAccounts";


const FreelancerBankAccountContainer = () => {

    const bankAccountsQuery = useUserBankAccountsQuery({
        fetchBankAccounts: true
    });

    return (
        bankAccountsQuery!.isLoading ?
            <Loading />
            : <div>
                {bankAccountsQuery!.data?.bankAccounts.length ?
                    <FreelancerBankAccounts bankAccountDetails={bankAccountsQuery!.data} />
                    : <FreelancerBankAccountForm externalAccountOnly={false} />
                }
            </div>
    )
}

export default FreelancerBankAccountContainer