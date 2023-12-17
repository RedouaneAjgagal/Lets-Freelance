import Stripe from "stripe";

type MyBankAccountDetails = {
    object: "bank_account",
    account_number: string,
    routing_number: string,
    account_holder_name: string,
    account_holder_type: string,
    country: string,
    currency: string
}

declare module 'stripe' {
    namespace Stripe {
        interface ExternalAccountCreateParamsV2 {
            external_account: MyBankAccountDetails;
            default_for_currency?: boolean;
            expand?: string[];
            metadata?: Stripe.MetadataParam;
        }
    }
}

declare module 'express-serve-static-core' {
    interface Request {
        rawBody?: string;
    }
}