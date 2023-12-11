import stripe from "./stripeConntect";

type CreatePaymentMethod = {
    userId: string;
    name: string;
    email: string;
    cardToken: string
}

type CreatePaymentMethodAndAttachToCustomer = CreatePaymentMethod & { customerId: string };

const createPaymentMethod = async ({ cardToken, email, name, userId }: CreatePaymentMethod) => {
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            token: cardToken
        },
        billing_details: {
            name,
            email
        },
        metadata: {
            freelancer_user_id: userId
        }
    });

    return paymentMethod;
}


export const createPaymentMethodAndAttachToCustomer = async ({ cardToken, customerId, email, name, userId }: CreatePaymentMethodAndAttachToCustomer) => {
    const paymentMethod = await createPaymentMethod({ cardToken, email, name, userId });

    const attachPaymentToCustomer = await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId
    });

    return attachPaymentToCustomer;
}


export default createPaymentMethod;