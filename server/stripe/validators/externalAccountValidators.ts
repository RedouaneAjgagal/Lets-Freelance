import Stripe from "stripe";
import emptyValuesChecker from "./emptyValuesChecker";

const isInvalidAccountNumber = (accountNumber: Stripe.AccountCreateParams.ExternalAccount["account_number"] | undefined) => {
    return emptyValuesChecker({
        allowedType: "string",
        errorValue: "Account number",
        value: accountNumber
    });
}

const isInvalidRoutingNumber = ({ routingNumber, isRequired }: { routingNumber: Stripe.AccountCreateParams.ExternalAccount["routing_number"] | undefined, isRequired: boolean }) => {
    if (!isRequired) return "";
    return emptyValuesChecker({
        allowedType: "string",
        errorValue: "Routing number",
        value: routingNumber
    });
}

const isInvalidAccountHolderName = (accountHolderName: Stripe.AccountCreateParams.ExternalAccount["account_holder_name"] | undefined) => {
    return emptyValuesChecker({
        allowedType: "string",
        errorValue: "Account holder name",
        value: accountHolderName
    });
}

const isInvalidAccountHolderType = (accountHolderType: Stripe.AccountCreateParams.ExternalAccount["account_holder_type"] | undefined) => {
    const accountHolderTypes = ["individual", "company"];

    const error = emptyValuesChecker({
        allowedType: "string",
        errorValue: "Account holder type",
        value: accountHolderType
    });

    if (error) return error;

    if (!accountHolderTypes.includes(accountHolderType!)) {
        return "Account holder type can only be individual or company";
    }

    return error;
}

const isInvalidTwoLetterCountry = (country: Stripe.AccountCreateParams.ExternalAccount["country"] | undefined) => {
    const error = emptyValuesChecker({
        allowedType: "string",
        errorValue: "Bank account country",
        value: country
    });

    if (error) return error;

    if (country!.trim().length !== 2) {
        return "Country must be only two letters, e.g. US"
    }

    return error;
}

const isInvalidCurrency = (currency: Stripe.AccountCreateParams.ExternalAccount["currency"] | undefined) => {
    const error = emptyValuesChecker({
        allowedType: "string",
        errorValue: "Bank account currency",
        value: currency
    });
    if (error) return error;

    if (currency!.trim().length !== 3) {
        return "Currency must be only three letters, e.g. usd"
    }
}

export {
    isInvalidAccountHolderName,
    isInvalidAccountHolderType,
    isInvalidAccountNumber,
    isInvalidCurrency,
    isInvalidRoutingNumber,
    isInvalidTwoLetterCountry
}