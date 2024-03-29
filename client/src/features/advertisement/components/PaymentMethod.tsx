import toUpperCase from "../../../utils/toUpperCase";
import useDeletePaymentMethodMutation from "../hooks/useDeletePaymentMethodMutation";
import { PaymentMethodType } from "../services/getPaymentMethods";


type PaymentMethodProps = {
    paymentMethod: PaymentMethodType;
}

const PaymentMethod = (props: React.PropsWithoutRef<PaymentMethodProps>) => {
    const deletePaymentMethodMutation = useDeletePaymentMethodMutation({
        paymentMethodId: props.paymentMethod.id
    });

    const brandName = toUpperCase({
        value: props.paymentMethod.brand
    });

    const deletePaymentMethodHandler = () => {
        if (deletePaymentMethodMutation.isLoading) return;

        deletePaymentMethodMutation.mutate({
            paymentMethodId: props.paymentMethod.id
        });
    }

    return (
        <div className="border border-slate-300 rounded py-3 px-4 bg-slate-50 shadow-sm flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <span className="text-slate-600">{brandName}</span>
                <div className="relative group">
                    <button className="px-3 border border-slate-400/70 rounded text-slate-600 shadow-sm shadow-slate-300">
                        •••
                    </button>
                    <div className="group-focus-within:visible group-focus-within:top-8 group-focus-within:opacity-100 opacity-0 invisible top-4 absolute right-0 z-10 bg-white min-w-[8rem] rounded border shadow-lg font-medium transition-all duration-200">
                        <button onClick={deletePaymentMethodHandler} className="py-1 px-2 w-full text-left text-red-600">
                            {deletePaymentMethodMutation.isLoading ? "Deleting.." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 font-medium">
                <span className="text-xl">•••• •••• ••••</span>
                <span className="text-lg">{props.paymentMethod.last4}</span>
            </div>
            <div>
                <p className="text-slate-600 text-sm">
                    {`${props.paymentMethod.exp_month} / ${props.paymentMethod.exp_year}`}
                </p>
            </div>
        </div >
    )
}

export default PaymentMethod