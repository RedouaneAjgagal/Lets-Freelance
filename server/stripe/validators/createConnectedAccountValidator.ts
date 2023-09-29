import Stripe from "stripe"
import isValidExternalAccountValues from "../helpers/isValidExternalAccountValues";
import isValidIndividualValues from "../helpers/isValidIndividualValues";

type CreateConnectedAccountValidator = {
    externalAccount: Stripe.AccountCreateParams.ExternalAccount;
    individual: Stripe.AccountCreateParams.Individual;
    isSsnRequired: boolean;
}

const createConnectedAccountValidator = ({ externalAccount, individual, isSsnRequired }: CreateConnectedAccountValidator) => {

    // --- external account validation --- //
    isValidExternalAccountValues(externalAccount);

    // --- Individual validation --- //
    isValidIndividualValues(individual, isSsnRequired);

}

export default createConnectedAccountValidator;