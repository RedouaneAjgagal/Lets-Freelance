import { AdvertisementNavbar, LoadingPaymentMethods, PaymentMethodsContainer, useGetPaymentMethodsQuery } from "../../features/advertisement"
import AdverisementPrimaryLink from "../../features/advertisement/components/AdverisementPrimaryLink";

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
                        <LoadingPaymentMethods numOfCards={3} />
                        : getPaymentMethodsQuery.data!.length ?
                            <PaymentMethodsContainer paymentMethods={getPaymentMethodsQuery.data!} />
                            : <div className="flex flex-col gap-2">
                                <p className="text-slate-600">You don't have any payment methods yet</p>
                                <AdverisementPrimaryLink to="/profile/freelancer/advertisements/payment-methods/create" fullWidth>
                                    ADD NEW ONE
                                </AdverisementPrimaryLink>
                            </div>
                }
            </div>
        </main>
    )
}

export default PaymentMethods