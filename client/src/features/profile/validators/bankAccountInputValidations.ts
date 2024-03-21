type EmptyValuesChecker = {
    allowedType: "string" | "number" | "boolean" | "function" | "object";
    errorValue: string;
    value: string | number | undefined;
}

const emptyValuesChecker = ({ allowedType, errorValue, value }: EmptyValuesChecker) => {
    let error = "";
    if (!value || value.toString().trim() === "") {
        return error = `${errorValue} is required`;
    }

    if (typeof value !== allowedType) {
        return error = `Invalid ${errorValue} format`;
    }
    return error;
}

const isInvalidFirstName = (firstName: string | undefined) => {
    return emptyValuesChecker({
        value: firstName,
        allowedType: "string",
        errorValue: "First name"
    });
};

const isInvalidLastName = (lastName: string | undefined) => {
    return emptyValuesChecker({
        value: lastName,
        allowedType: "string",
        errorValue: "Last name"
    });
};

const isInvalidEmail = (email: string | undefined) => {
    const isEmpty = emptyValuesChecker({
        value: email,
        allowedType: "string",
        errorValue: "Email"
    });

    if (isEmpty) {
        return isEmpty;
    }

    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email!);
    if (!validEmailRegex) {
        return "Invalid email";
    }

    return "";
};

const isInvalidDob = (dob: string | undefined) => {
    const isEmpty = emptyValuesChecker({
        value: dob,
        allowedType: "string",
        errorValue: "Date of birth"
    });

    if (isEmpty) {
        return isEmpty;
    }

    const date = new Date(dob!);
    if (date.toString() === "Invalid Date") {
        return "Invalid date";
    }

    const now = new Date();
    if (date.getTime() > now.getTime()) {
        return "Invalid date of birth";
    }

    return "";
}

const isInvalidCountry = (country: string | undefined) => {
    const isEmpty = emptyValuesChecker({
        value: country,
        allowedType: "string",
        errorValue: "Country"
    });

    if (isEmpty) {
        return isEmpty;
    }

    if (country!.trim().length !== 2) {
        return "Country length must be 2";
    }

    return "";
}

const isInvalidCity = (city: string | undefined) => {
    return emptyValuesChecker({
        value: city,
        allowedType: "string",
        errorValue: "City"
    });
}

const isInvalidState = (state: string | undefined) => {
    if (state) {
        return emptyValuesChecker({
            value: state,
            allowedType: "string",
            errorValue: "State"
        });
    }
    return "";
}

const isInvalidPostalCode = (postalCode: string | undefined) => {
    return emptyValuesChecker({
        value: postalCode,
        allowedType: "string",
        errorValue: "Postal code"
    });
}

const isInvalidLineOne = (lineOne: string | undefined) => {
    return emptyValuesChecker({
        value: lineOne,
        allowedType: "string",
        errorValue: "Line 1"
    });
}

const isInvalidLineTwo = (lineTwo: string | undefined) => {
    if (lineTwo) {
        return emptyValuesChecker({
            value: lineTwo,
            allowedType: "string",
            errorValue: "Line 2"
        });
    }
    return "";
}

const isInvalidAccountNumber = (accountNumber: string | undefined) => {
    return emptyValuesChecker({
        value: accountNumber,
        allowedType: "string",
        errorValue: "Account number"
    });
}

const isInvalidRoutingNumber = (routingNumber: string | undefined) => {
    if (!routingNumber) {
        return ""
    };

    const isEmpty = emptyValuesChecker({
        value: routingNumber,
        allowedType: "string",
        errorValue: "Routing number"
    });

    if (isEmpty) {
        return isEmpty;
    }

    const isValidRoutingNumber = /^\d+(-\d+)*$/.test(routingNumber);
    if (!isValidRoutingNumber) {
        return "Invalid routing number";
    }

    return "";
}

const isInvalidFullName = (fullName: string | undefined) => {
    const isEmpty = emptyValuesChecker({
        value: fullName,
        allowedType: "string",
        errorValue: "Full name"
    });

    if (isEmpty) {
        return isEmpty;
    }

    const isValidFullName = fullName!.trim().split(" ").length > 1;
    if (!isValidFullName) {
        return "Provide a valid full name";
    }

    return "";
}

const isInvalidCurrency = (currency: string | undefined) => {
    const isEmpty = emptyValuesChecker({
        value: currency,
        allowedType: "string",
        errorValue: "Currency"
    });

    if (isEmpty) {
        return isEmpty;
    }

    if (currency!.trim().length !== 3) {
        return "Currency length must be 3";
    }

    return "";
}

const BankAccountInputValidation = {
    isInvalidAccountNumber,
    isInvalidCity,
    isInvalidCountry,
    isInvalidCurrency,
    isInvalidDob,
    isInvalidEmail,
    isInvalidFirstName,
    isInvalidFullName,
    isInvalidLastName,
    isInvalidLineOne,
    isInvalidLineTwo,
    isInvalidPostalCode,
    isInvalidRoutingNumber,
    isInvalidState
}

export default BankAccountInputValidation;