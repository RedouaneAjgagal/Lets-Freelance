import { BadRequestError } from "../../../errors";
import { isInvalidCardToken, isInvalidEmail, isInvalidPaymentMethodName } from "./inputValidations";

type CreateCustomerValidator = {
    name: any;
    email: any;
    cardToken: any;
}

const createCustomerValidator = (input: CreateCustomerValidator) => {
    const invalidEmail = isInvalidEmail(input.email);
    if (invalidEmail) {
        throw new BadRequestError(invalidEmail);
    }

    const invalidName = isInvalidPaymentMethodName(input.name);
    if (invalidName) {
        throw new BadRequestError(invalidName);
    }

    const invalidCardToken = isInvalidCardToken(input.cardToken);
    if (invalidCardToken) {
        throw new BadRequestError(invalidCardToken);
    }
}

export default createCustomerValidator;