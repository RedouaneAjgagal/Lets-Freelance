import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentMethodForm from "../../features/advertisement/components/PaymentMethodForm";
import { AdvertisementNavbar } from "../../features/advertisement";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);

const CreatePaymentMethod = () => {
    return (
        <main className="flex flex-col">
            <div className="mt-6">
                <AdvertisementNavbar />
            </div>
            <h1 className="text-3xl font-semibold p-4">Create Payment Method</h1>
            <div className="flex flex-col gap-2 p-4">
                <h2 className="text-xl font-medium">Test account</h2>
                <div className="p-4 px-5 flex flex-col bg-slate-50 self-start rounded shadow-sm">
                    <div className="flex gap-x-8 gap-y-4 flex-wrap">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-medium">Card number</h3>
                            <p className="text-slate-700">4242 4242 4242 4242</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-medium">Expiration</h3>
                            <p className="text-slate-700">
                                {`12 / ${(new Date().getFullYear() + 1).toString().slice(2)}`}
                            </p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-medium">CVC</h3>
                            <p className="text-slate-700">123</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <Elements stripe={stripePromise} options={{
                    mode: "setup",
                    currency: "usd"
                }}>
                    <PaymentMethodForm />
                </Elements>
            </div>
        </main>
    )
}

export default CreatePaymentMethod