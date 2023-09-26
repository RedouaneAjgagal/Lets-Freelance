import Stripe from "stripe";
import stripe from "./stripeConntect";

type CreateConnectedAccount = {
    userId: string;
    profileId: string;
    email: string;
    country: string;
    individual: {
        email: Stripe.AccountCreateParams.Individual["email"];
        address: Stripe.AccountCreateParams.Individual["address"];
        phone: Stripe.AccountCreateParams.Individual["phone"];
        first_name: Stripe.AccountCreateParams.Individual["first_name"];
        last_name: Stripe.AccountCreateParams.Individual["last_name"];
        dob: Stripe.AccountCreateParams.Individual["dob"];
    } & Partial<Stripe.AccountCreateParams.Individual>;
    externalAccount: Stripe.AccountCreateParams.ExternalAccount;
    tosAcceptance: Stripe.AccountCreateParams.TosAcceptance;
}

const createConnectedAccount = async ({ email, userId, profileId, country, externalAccount, individual, tosAcceptance }: CreateConnectedAccount) => {
    const account = await stripe.accounts.create({
        type: "custom",
        email,
        country,
        individual,
        default_currency: "usd",
        business_type: "individual",
        external_account: externalAccount,
        tos_acceptance: tosAcceptance,
        capabilities: {
            transfers: {
                requested: true // freelancers are only going to receive payments so no need for card_payments
            },
        },
        business_profile: {
            url: `https://github.com/profiles/${profileId}` // set github.com to the production url once its live
        },
        metadata: {
            "platform_user_id": userId,
            "platform_profile_id": profileId
        }
    });
    return account;
}

export default createConnectedAccount;