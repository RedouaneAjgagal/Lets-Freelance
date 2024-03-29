import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { clientURL } from '../../../config/baseURL';
import useCreatePaymentMethodMutation from '../hooks/useCreatePaymentMethodMutation';
import useDefaultPaymentAndPayUnpaidInvoicesMutation from '../hooks/useDefaultPaymentAndPayUnpaidInvoicesMutation';
import { TbLoader } from "react-icons/tb";
import { useEffect, useState } from 'react';

const PaymentMethodForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const stripe = useStripe();
    const elements = useElements();

    const createPaymentMethodMutation = useCreatePaymentMethodMutation();
    const defaultPaymentAndPayUnpaidInvoicesMutation = useDefaultPaymentAndPayUnpaidInvoicesMutation();

    const createPaymentMethodHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            console.log("No stripe");

            return;
        }

        const submitElements = await elements!.submit();
        if (submitElements?.error) {
            console.log("Error");
            return;
        }

        const { client_secret } = await createPaymentMethodMutation.mutateAsync();

        const { setupIntent } = await stripe.confirmSetup({
            clientSecret: client_secret,
            elements,
            redirect: "if_required",
            confirmParams: {
                return_url: clientURL
            }
        });

        defaultPaymentAndPayUnpaidInvoicesMutation.mutate({
            paymentMethodId: setupIntent!.payment_method!.toString()
        });
    }

    useEffect(() => {
        if (createPaymentMethodMutation.isLoading) {
            setIsLoading(true);
        }

        if (defaultPaymentAndPayUnpaidInvoicesMutation.isSuccess || defaultPaymentAndPayUnpaidInvoicesMutation.isError) {
            setIsLoading(false);
        }
    }, [createPaymentMethodMutation.isLoading, defaultPaymentAndPayUnpaidInvoicesMutation.isSuccess, defaultPaymentAndPayUnpaidInvoicesMutation.isError]);

    // const isLoading = createPaymentMethodMutation.isLoading || defaultPaymentAndPayUnpaidInvoicesMutation.isLoading;

    return (
        <form onSubmit={createPaymentMethodHandler} className='flex flex-col gap-4'>
            <PaymentElement />
            <button disabled={isLoading} className="flex justify-center items-center border-2 border-slate-600 font-semibold h-10 rounded bg-amber-500 relative">
                {isLoading ?
                    <>
                        <span className="invisible absolute">
                            ADD PAYMENT METHOD
                        </span>
                        <TbLoader size={24} className="animate-spin" />
                    </>
                    : "ADD PAYMENT METHOD"
                }
            </button>
        </form>
    )
}



export default PaymentMethodForm