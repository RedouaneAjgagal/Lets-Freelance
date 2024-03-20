import InfoModal from "../../../layouts/brand/InfoModal";
import { UserBankAccount, useRemoveExternalBankAccountMutation } from "../../auth";
import { BsBank } from "react-icons/bs";
import { TbDots } from "react-icons/tb";

type FreelancerBankAccountProps = {
    bankAccount: UserBankAccount;
    isDefaultCurrency: boolean;
    currencies: string[];
}

const FreelancerBankAccount = (props: React.PropsWithoutRef<FreelancerBankAccountProps>) => {
    const removeExternalBankAccountMutation = useRemoveExternalBankAccountMutation();

    const removeExternalBankAccountHanlder = () => {
        if (props.bankAccount.isDefault || removeExternalBankAccountMutation.isLoading || removeExternalBankAccountMutation.isSuccess) return;
        removeExternalBankAccountMutation.mutate({
            bankAccountId: props.bankAccount._id
        });
    }

    return (
        <li className="border-b last:border-b-0 border-slate-300 p-3 flex items-center gap-1 justify-between">
            <div className="flex items-center gap-2 min-h-[2.25rem]">
                <div>
                    <BsBank />
                </div>
                <div className="font-medium">
                    <span className="mr-1 text-lg">••••</span>
                    <span className="text-[.95rem]">{props.bankAccount.accountLastFour}</span>
                </div>
                <div className="flex self-start gap-1 flex-wrap">
                    <span className="text-sm bg-slate-300/60 py-[.1rem] px-2 rounded font-medium text-slate-600">{props.bankAccount.currency.toUpperCase()}</span>
                    {props.bankAccount.isDefault ?
                        <div className="text-sm bg-sky-200 py-[.1rem] px-2 rounded font-medium text-blue-600 flex items-center justify-center relative group">
                            {
                                props.isDefaultCurrency ?
                                    <>
                                        <span>Default</span>
                                        <InfoModal content={
                                            props.currencies.length ?
                                                `All paylouts except ${props.currencies.map(currency => currency.toUpperCase()).join(", ")} will be converted to ${props.bankAccount.currency.toUpperCase()}`
                                                : `All payouts will be converted to ${props.bankAccount.currency.toUpperCase()}`
                                        } position="center" width="sm" />
                                    </>
                                    : <span>Default for {props.bankAccount.currency.toUpperCase()}</span>
                            }
                        </div>
                        : null
                    }
                </div>
            </div>
            {
                props.bankAccount.isDefault ?
                    null
                    : <div className="relative group">
                        <button className="py-[.2rem] px-2 border border-slate-400/70 rounded text-slate-600 shadow-sm shadow-slate-300">
                            <TbDots />
                        </button>
                        <div className="group-focus-within:visible group-focus-within:top-8 group-focus-within:opacity-100 opacity-0 invisible top-4 absolute right-0 z-10 bg-white min-w-[8rem] rounded border shadow-lg font-medium transition-all duration-200">
                            <button onClick={removeExternalBankAccountHanlder} className="py-1 px-2 w-full text-left text-red-600">
                                {removeExternalBankAccountMutation.isLoading || removeExternalBankAccountMutation.isSuccess ? "Removing.."
                                    : "Remove"}
                            </button>
                        </div>
                    </div>
            }
        </li>
    )
}

export default FreelancerBankAccount