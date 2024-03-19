import Stripe from "stripe";
import { isInvalidAccountHolderName, isInvalidAccountHolderType, isInvalidAccountNumber, isInvalidCurrency, isInvalidRoutingNumber, isInvalidTwoLetterCountry } from "../validators/externalAccountValidators";
import { BadRequestError } from "../../errors";

const isValidExternalAccountValues = (externalAccount: Stripe.TokenCreateParams.BankAccount) => {
    const invalidAccountNumber = isInvalidAccountNumber(externalAccount.account_number);
    if (invalidAccountNumber) {
        throw new BadRequestError(invalidAccountNumber);
    }

    const invalidRoutingNumber = isInvalidRoutingNumber({ routingNumber: externalAccount.routing_number, isRequired: false });
    if (invalidRoutingNumber) {
        throw new BadRequestError(invalidRoutingNumber);
    }

    const invalidAccountHolderName = isInvalidAccountHolderName(externalAccount.account_holder_name);
    if (invalidAccountHolderName) {
        throw new BadRequestError(invalidAccountHolderName);
    }

    const invalidAccountHolderType = isInvalidAccountHolderType(externalAccount.account_holder_type);
    if (invalidAccountHolderType) {
        throw new BadRequestError(invalidAccountHolderType);
    }

    const invalidTwoLetterCountry = isInvalidTwoLetterCountry(externalAccount.country);
    if (invalidTwoLetterCountry) {
        throw new BadRequestError(invalidTwoLetterCountry);
    }

    const invalidCurrency = isInvalidCurrency(externalAccount.currency);
    if (invalidCurrency) {
        throw new BadRequestError(invalidCurrency);
    }
}

export default isValidExternalAccountValues;