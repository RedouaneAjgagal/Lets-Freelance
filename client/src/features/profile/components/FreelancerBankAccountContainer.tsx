import Loading from "../../../components/Loading";
import { useUserBankAccountsQuery } from "../../auth"
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
                    : <p>Bank account form</p>
                }
            </div>
    )
}

export default FreelancerBankAccountContainer