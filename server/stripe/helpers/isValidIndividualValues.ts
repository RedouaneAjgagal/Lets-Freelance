import Stripe from "stripe";
import { BadRequestError } from "../../errors";
import { isInvalidAddress, isInvalidDateOfBirth, isInvalidEmail, isInvalidFirstName, isInvalidLastName, isInvalidPhoneNumber, isInvalidSsn } from "../validators/individualValidators";

const isValidIndividualValues = (individual: Stripe.AccountCreateParams.Individual, isSsnRequired: boolean) => {
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

    const invalidSsn = isInvalidSsn({ ssn: individual.id_number, isRequired: isSsnRequired });
    if (invalidSsn) {
        throw new BadRequestError(invalidSsn);
    }
}

export default isValidIndividualValues;