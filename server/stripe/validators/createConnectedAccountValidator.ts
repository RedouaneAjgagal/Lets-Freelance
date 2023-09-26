import Stripe from "stripe"
import { isInvalidAccountHolderName, isInvalidAccountHolderType, isInvalidAccountNumber, isInvalidCurrency, isInvalidRoutingNumber, isInvalidTwoLetterCountry } from "./externalAccountValidators"
import { isInvalidAddress, isInvalidDateOfBirth, isInvalidEmail, isInvalidFirstName, isInvalidLastFourSsn, isInvalidLastName, isInvalidPhoneNumber } from "./individualValidators"
import { BadRequestError } from "../../errors";

type CreateConnectedAccountValidator = {
    externalAccount: Stripe.AccountCreateParams.ExternalAccount;
    individual: Stripe.AccountCreateParams.Individual;
}

const createConnectedAccountValidator = ({ externalAccount, individual }: CreateConnectedAccountValidator) => {

    // --- external account validation --- //

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


    // --- Individual validation --- //

    const invalidEmail = isInvalidEmail(individual.email);
    if (invalidEmail) {
        throw new BadRequestError(invalidEmail);
    }

    const invalidAddress = isInvalidAddress({ address: individual.address!, isStateRequired: false });
    if (invalidAddress.length) {
        throw new BadRequestError(invalidAddress[0]);
    }

    const invalidDateOfBirth = isInvalidDateOfBirth(individual.dob as Stripe.AccountCreateParams.Individual.Dob);
    if (invalidDateOfBirth.length) {
        throw new BadRequestError(invalidDateOfBirth[0]);
    }

    const invalidFirstName = isInvalidFirstName(individual.first_name);
    if (invalidFirstName) {
        throw new BadRequestError(invalidFirstName);
    }

    const invalidLastName = isInvalidLastName(individual.last_name);
    if (invalidLastName) {
        throw new BadRequestError(invalidLastName);
    }

    const invalidPhoneNumber = isInvalidPhoneNumber(individual.phone);
    if (invalidPhoneNumber) {
        throw new BadRequestError(invalidPhoneNumber);
    }

    // const invalidSsn = isInvalidLastFourSsn({ ssn: individual.ssn_last_4, isRequired: false });
    // if (invalidSsn) {
    //     throw new BadRequestError(invalidSsn);
    // }
}

export default createConnectedAccountValidator;