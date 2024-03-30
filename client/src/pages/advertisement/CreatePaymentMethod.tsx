import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentMethodForm from "../../features/advertisement/components/PaymentMethodForm";
import { AdvertisementNavbar } from "../../features/advertisement";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);

const CreatePaymentMethod = () => {
    return (
        <main className="bg-slate-200/70 flex flex-col">
            <div className="mt-6">
                <AdvertisementNavbar />
            </div>
            <h1 className="text-3xl font-semibold p-4">Create Payment Method</h1>
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