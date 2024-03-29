import { Link } from "react-router-dom"
import { AdvertisementNavbar, PaymentMethodsContainer, useGetPaymentMethodsQuery } from "../../features/advertisement"
import Loading from "../../components/Loading";


const PaymentMethods = () => {

    const getPaymentMethodsQuery = useGetPaymentMethodsQuery();

    return (
        <main className="bg-slate-200/70 flex flex-col">
            <div className="mt-6">
                <AdvertisementNavbar />
            </div>
            <h1 className="text-3xl font-semibold p-4">My Payment Methods</h1>
            <div className="p-4">
                {
                    getPaymentMethodsQuery.isLoading ?
                        <Loading />
                        : getPaymentMethodsQuery.data!.length ?
                            <PaymentMethodsContainer paymentMethods={getPaymentMethodsQuery.data!} />
                            : <div className="flex flex-col gap-2">
                                <p className="text-slate-600">You don't have any payment methods yet</p>
                                <Link className="flex justify-center border-2 border-slate-600 font-semibold py-1 rounded bg-amber-500" to={"/profile/freelancer/advertisements/payment-methods/create"}>ADD NEW ONE</Link>
                            </div>
                }
            </div>
        </main>
    )
}

export default PaymentMethods