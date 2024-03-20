import { UserBankAccountsResponse } from "../../auth"
import FreelancerBankAccount from "./FreelancerBankAccount";

type FreelancerBankAccountsProps = {
    bankAccountDetails: UserBankAccountsResponse
}

const FreelancerBankAccounts = (props: React.PropsWithoutRef<FreelancerBankAccountsProps>) => {

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

    return (
        <ul className="bg-slate-200/50 border rounded">
            {bankAccounts}
        </ul>
    )
}

export default FreelancerBankAccounts