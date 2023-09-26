import emptyValuesChecker from "./emptyValuesChecker";
import Stripe from "stripe";


const isInvalidEmail = (email: Stripe.AccountCreateParams.Individual["email"] | undefined) => {
    const error = emptyValuesChecker({
        allowedType: "string",
        errorValue: "Email",
        value: email
    });

    if (error) return error;

    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email!);
    if (!validEmailRegex) {
        return "Invalid email";
    }

    return error;
}


const isInvalidFirstName = (firstName: Stripe.AccountCreateParams.Individual["first_name"] | undefined) => {
    return emptyValuesChecker({
        allowedType: "string",
        errorValue: "First name",
        value: firstName
    });
}

const isInvalidLastName = (lastName: Stripe.AccountCreateParams.Individual["last_name"] | undefined) => {
    return emptyValuesChecker({
        allowedType: "string",
        errorValue: "Last name",
        value: lastName
    });
}

const isInvalidPhoneNumber = (phoneNumber: Stripe.AccountCreateParams.Individual["phone"] | undefined) => {
    const error = emptyValuesChecker({
        allowedType: "string",
        errorValue: "Phone number",
        value: phoneNumber
    });

    if (error) return error;

    const validPhoneNumberRegex = /^\+\d{1,15}$/.test(phoneNumber!);
    if (!validPhoneNumberRegex) {
        return "Invalid phone number";
    }
    return error;
}

const isInvalidAddress = ({ address, isStateRequired }: { address: Stripe.AddressParam | undefined, isStateRequired: boolean }) => {
    const requiredPaths: ["country", "city", "postal_code", "line1"] = ["country", "city", "postal_code", "line1"];

    let errors: string[] = [];

    requiredPaths.forEach((path) => {
        const error = emptyValuesChecker({
            allowedType: "string",
            errorValue: path,
            value: address ? address[path] : undefined
        });

        if (error) errors.push(error);
    });

    if (address?.line2 !== undefined) {
        const error = emptyValuesChecker({
            allowedType: "string",
            errorValue: "line2",
            value: address.line2
        });

        if (error) errors.push(error);
    }

    if (isStateRequired) {
        const error = emptyValuesChecker({
            allowedType: "string",
            errorValue: "State",
            value: address?.state
        });

        if (error) errors.push(error);
    }

    return errors;
}

const isInvalidDateOfBirth = (dateOfBirth: Stripe.AccountCreateParams.Individual.Dob | undefined) => {
    const requiredPaths: ["day", "month", "year"] = ["day", "month", "year"];

    const errors: string[] = [];

    requiredPaths.forEach((path) => {
        const error = emptyValuesChecker({
            allowedType: "number",
            errorValue: `Birth ${path}`,
            value: dateOfBirth ? dateOfBirth[path] : undefined
        });
        if (error) errors.push(error);
    })

    return errors;
}

const isInvalidLastFourSsn = ({ ssn, isRequired }: { ssn: Stripe.AccountCreateParams.Individual["ssn_last_4"] | undefined, isRequired: boolean }) => {
    if (!isRequired) return "";

    const error = emptyValuesChecker({
        allowedType: "string",
        errorValue: "Last four SSN",
        value: ssn
    });

    if (error) return error;

    if (ssn!.trim().length !== 4) {
        return "Must be four numbers";
    }

    return error;
}

export {
    isInvalidEmail,
    isInvalidAddress,
    isInvalidDateOfBirth,
    isInvalidFirstName,
    isInvalidLastName,
    isInvalidPhoneNumber,
    isInvalidLastFourSsn
}