import { Link } from "react-router-dom"
import { PaymentMethodsContainer, useGetPaymentMethodsQuery } from "../../features/advertisement"
import Loading from "../../components/Loading";


const PaymentMethods = () => {

    const getPaymentMethodsQuery = useGetPaymentMethodsQuery();

    return (
        <main className="p-4 bg-slate-200 flex flex-col gap-6">
            <h1 className="text-3xl font-semibold">My Payment Methods</h1>
            {
                getPaymentMethodsQuery.isLoading ?
                    <Loading />
                    : getPaymentMethodsQuery.data!.length ?
                        <PaymentMethodsContainer paymentMethods={getPaymentMethodsQuery.data!} />
                        : <div className="flex flex-col gap-2">
                            <p className="text-slate-600">You don't have any payment methods yet</p>
                            <Link className="flex justify-center border-2 border-slate-600 font-semibold py-1 rounded bg-amber-500" to={"/"}>ADD NEW ONE</Link>
                        </div>
            }
        </main>
    )
}

export default PaymentMethods