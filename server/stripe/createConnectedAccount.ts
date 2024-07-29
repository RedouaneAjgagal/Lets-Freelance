import Stripe from "stripe";
import stripe from "./stripeConntect";
import origin from "../config/origin";

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
    externalAccount: Stripe.TokenCreateParams.BankAccount;
    tosAcceptance: Stripe.AccountCreateParams.TosAcceptance;
}

const createConnectedAccount = async ({ email, userId, profileId, country, externalAccount, individual, tosAcceptance }: CreateConnectedAccount) => {
    const token = await stripe.tokens.create({
        bank_account: externalAccount
    });

    const account = await stripe.accounts.create({
        type: "custom",
        email,
        country,
        individual,
        external_account: token.id,
        business_type: externalAccount.account_holder_type,
        tos_acceptance: tosAcceptance,
        capabilities: {
            transfers: {
                requested: true
            },
            card_payments: {
                requested: true
            }
        },
        business_profile: {
            url: `${origin}/profiles/${profileId}`,
            mcc: "7379" // initial mcc for now
        },
        metadata: {
            "platform_user_id": userId,
            "platform_profile_id": profileId
        },
        settings: {
            payouts: {
                schedule: {
                    delay_days: 10,
                    interval: "daily"
                }
            }
        }
    });
    return account;
}

export default createConnectedAccount;