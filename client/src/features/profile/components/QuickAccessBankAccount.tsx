import { TbLoader2 } from "react-icons/tb";
import { useAddExtertaBankAccountMutation, useSetBankAccountMutation } from "../../auth";
import bank_accounts_quick_access from "../../auth/helpers/bank_accounts_quick_access"
import { useState } from "react";

type QuickAccessBankAccountProps = {
    externalAccountOnly: boolean;
    onClose?: () => void;
}

const QuickAccessBankAccount = (props: React.PropsWithoutRef<QuickAccessBankAccountProps>) => {
    const [currency, setCurrency] = useState("");

    const addExtertaBankAccountMutation = useAddExtertaBankAccountMutation({
        onClose: props.onClose
    });

    const setBankAccountMutation = useSetBankAccountMutation();

    const isLoading = addExtertaBankAccountMutation.isLoading || setBankAccountMutation.isLoading;

    return (
        <div className="flex flex-wrap gap-2">
            {bank_accounts_quick_access.generalBankAccounts.map(bankAccount => {

                const setBankAccountHandler = () => {
                    if (isLoading) return;

                    setCurrency(bankAccount.currency);

                    if (props.externalAccountOnly) {
                        addExtertaBankAccountMutation.mutate({
                            accountNumber: bankAccount.accountNumber,
                            routingNumber: bankAccount.routingNumber,
                            accountHolderName: bankAccount.accountHolderName,
                            accountHolderType: bankAccount.accountHolderType,
                            accountCountry: bankAccount.accountCountry,
                            currency: bankAccount.currency
                        });
                    } else {
                        setBankAccountMutation.mutate(bankAccount);
                    }
                }

                return (
                    <button disabled={isLoading} onClick={setBankAccountHandler} className="flex items-center justify-center self-start py-1 px-2 rounded bg-white border font-medium shadow-sm" key={bankAccount.currency} type="button">
                        {isLoading && currency === bankAccount.currency ?
                            <>
                                <span className="invisible">
                                    {bankAccount.currency.toUpperCase()}
                                </span>
                                <TbLoader2 className="animate-spin absolute" size={20} />
                            </>
                            : bankAccount.currency.toUpperCase()
                        }
                    </button>
                )
            })}
        </div>
    )
}

export default QuickAccessBankAccount