import BankAccountInputValidation from "./bankAccountInputValidations";

type BankAccountFormData = {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    dob: string | undefined;
    country: string | undefined;
    city: string | undefined;
    state: string | undefined;
    postalCode: string | undefined;
    line1: string | undefined;
    line2: string | undefined;
} & ExternalAccountFormData;

type ExternalAccountFormData = {
    accountNumber: string | undefined;
    routingNumber: string | undefined;
    fullName: string | undefined;
    bankCountry: string | undefined;
    currency: string | undefined;
}

type BankAccountValidator = {
    formData: BankAccountFormData;
    externalAccountOnly: false;
}


type ExternalBankAccountValidator = {
    formData: ExternalAccountFormData;
    externalAccountOnly: true;
}



const bankAccountValidator = (payload: (BankAccountValidator | ExternalBankAccountValidator)) => {
    const inputErrors = {
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        country: "",
        city: "",
        state: "",
        postalCode: "",
        line1: "",
        line2: "",
        accountNumber: "",
        routingNumber: "",
        fullName: "",
        bankCountry: "",
        currency: "",
    };

    if (!payload.externalAccountOnly) {
        const invalidFirstName = BankAccountInputValidation.isInvalidFirstName(payload.formData.firstName);
        if (invalidFirstName) {
            inputErrors.firstName = invalidFirstName;
        }

        const invalidLastName = BankAccountInputValidation.isInvalidLastName(payload.formData.lastName);
        if (invalidLastName) {
            inputErrors.lastName = invalidLastName;
        }

        const invalidEmail = BankAccountInputValidation.isInvalidEmail(payload.formData.email);
        if (invalidEmail) {
            inputErrors.email = invalidEmail;
        }

        const invalidDob = BankAccountInputValidation.isInvalidDob(payload.formData.dob);
        if (invalidDob) {
            inputErrors.dob = invalidDob;
        }

        const invalidCountry = BankAccountInputValidation.isInvalidCountry(payload.formData.country);
        if (invalidCountry) {
            inputErrors.country = invalidCountry;
        }

        const invalidCity = BankAccountInputValidation.isInvalidCity(payload.formData.city);
        if (invalidCity) {
            inputErrors.city = invalidCity;
        }

        const invalidState = BankAccountInputValidation.isInvalidState(payload.formData.state);
        if (invalidState) {
            inputErrors.state = invalidState;
        }

        const invalidPostalCode = BankAccountInputValidation.isInvalidPostalCode(payload.formData.postalCode);
        if (invalidPostalCode) {
            inputErrors.postalCode = invalidPostalCode;
        }

        const invalidLineOne = BankAccountInputValidation.isInvalidLineOne(payload.formData.line1);
        if (invalidLineOne) {
            inputErrors.line1 = invalidLineOne;
        }

        const invalidLineTwo = BankAccountInputValidation.isInvalidLineTwo(payload.formData.line2);
        if (invalidLineTwo) {
            inputErrors.line2 = invalidLineTwo;
        }
    }

    const invalidAccountNumber = BankAccountInputValidation.isInvalidAccountNumber(payload.formData.accountNumber);
    if (invalidAccountNumber) {
        inputErrors.accountNumber = invalidAccountNumber;
    }

    const invalidRoutingNumber = BankAccountInputValidation.isInvalidRoutingNumber(payload.formData.routingNumber);
    if (invalidRoutingNumber) {
        inputErrors.routingNumber = invalidRoutingNumber;
    }

    const invalidFullName = BankAccountInputValidation.isInvalidFullName(payload.formData.fullName);
    if (invalidFullName) {
        inputErrors.fullName = invalidFullName;
    }

    const invalidBankCountry = BankAccountInputValidation.isInvalidCountry(payload.formData.bankCountry);
    if (invalidBankCountry) {
        inputErrors.bankCountry = invalidBankCountry;
    }

    const invalidCurrency = BankAccountInputValidation.isInvalidCurrency(payload.formData.currency);
    if (invalidCurrency) {
        inputErrors.currency = invalidCurrency;
    }

    return inputErrors;
}

export default bankAccountValidator;