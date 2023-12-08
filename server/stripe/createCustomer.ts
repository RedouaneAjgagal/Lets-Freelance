import stripe from "./stripeConntect"

type CreateCustomer = {
    userId: string;
    name: string;
    email: string;
    cardToken: string;
}

const createCustomer = async ({ userId, cardToken, name, email }: CreateCustomer) => {
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            token: cardToken
        },
    });

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