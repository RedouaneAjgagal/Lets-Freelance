import { BadRequestError } from "../../../errors";
import { AuthInputs, nameValidation, emailValidation, passwordValidation, roleValidation, tokenValidation } from "./inputValidations";

// validation for register
const registerInputValidations = ({ name, email, password, userAs }: AuthInputs) => {
    nameValidation(name);
    emailValidation(email);
    passwordValidation(password);
    roleValidation(userAs);
}

// validation for login
const loginInputValidations = ({ email, password }: { email: AuthInputs["email"], password: AuthInputs["password"] }) => {
    emailValidation(email);
    passwordValidation(password);
}

// validation for requesting password reset
const forgetPasswordValidation = ({ email }: { email: AuthInputs["email"] }) => {
    emailValidation(email);
}

// validation for verify emails
const verifyEmailValidation = ({ email, token }: { email: AuthInputs["email"], token: AuthInputs["token"] }) => {
    emailValidation(email);
    tokenValidation(token);
}

// validation for reset the password
const resetPasswordValidation = ({ email, newPassword, repeatNewPassword, token }: {
    email: AuthInputs["email"],
    newPassword: AuthInputs["password"],
    repeatNewPassword: AuthInputs["email"],
    token: AuthInputs["token"]
}) => {
    emailValidation(email);
    tokenValidation(token);
    passwordValidation(newPassword);
    passwordValidation(repeatNewPassword);
    const isPasswordsMatch = newPassword === repeatNewPassword;
    if (!isPasswordsMatch) {
        throw new BadRequestError("Passwords does not match");
    }
}

export {
    registerInputValidations,
    loginInputValidations,
    forgetPasswordValidation,
    resetPasswordValidation,
    verifyEmailValidation
};