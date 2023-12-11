import stripe from "./stripeConntect";
import createPaymentMethod from "./createPaymentMethod";

type CreateCustomer = {
    userId: string;
    name: string;
    email: string;
    cardToken: string;
}

const createCustomer = async ({ userId, cardToken, name, email }: CreateCustomer) => {
    // create payment method
    const paymentMethod = await createPaymentMethod({ cardToken, email, name, userId });

    // create customer
    const customer = await stripe.customers.create({
        name,
        email,
        payment_method: paymentMethod.id,
        invoice_settings: {
            default_payment_method: paymentMethod.id
        },
        metadata: {
            freelancer_user_id: userId
        }
    }); 

    return customer;
}

export default createCustomer;