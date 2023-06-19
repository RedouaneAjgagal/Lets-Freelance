import { BadRequestError } from "../errors";

type AuthInputs = {
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;
    userAs: "freelancer" | "client" | undefined;
}

const validName = (name: AuthInputs["name"]) => {
    if (!name || name.trim() === "") {
        return { success: false, reason: "Name is required." };
    }
    if (name.trim().length < 3 || name.trim().length > 20) {
        return { success: false, reason: "Name must be between 3 and 20 characters." }
    }
    return { success: true, reason: null }
}

const validEmail = (email: AuthInputs["email"]) => {
    if (!email || email.trim() === "") {
        return { success: false, reason: "Email is required." };
    }
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    if (!validEmail) {
        return { success: false, reason: "Invalid email." };
    }
    return { success: true, reason: null };
}

const validPassowrd = (password: AuthInputs["password"]) => {
    if (!password || password.trim() === "") {
        return { success: false, reason: "Password is required." };
    }
    if (password.trim().length < 6 || password.trim().length > 60) {
        return { success: false, reason: "Password must be between 6 and 60 characters." }
    }
    return { success: true, reason: null }
}

const validRole = (userAs: AuthInputs["userAs"]) => {
    if (!userAs || userAs.trim() === "") {
        return { success: false, reason: "Role is required." };
    }
    if (userAs !== "freelancer" && userAs !== "client") {
        return { success: false, reason: "Can only be Freelancer or Client." };
    }
    return { success: true, reason: null };
}

// validation for register
const registerInputValidations = ({ name, email, password, userAs }: AuthInputs) => {
    const isValidName = validName(name);
    if (!isValidName.success) {
        throw new BadRequestError(isValidName.reason!);
    }

    const isValidEmail = validEmail(email);
    if (!isValidEmail.success) {
        throw new BadRequestError(isValidEmail.reason!);
    }

    const isValidPassowrd = validPassowrd(password)
    if (!isValidPassowrd.success) {
        throw new BadRequestError(isValidPassowrd.reason!);
    }

    const isValidRole = validRole(userAs);
    if (!isValidRole.success) {
        throw new BadRequestError(isValidRole.reason!);
    }
}

// validation for login
const loginInputValidations = ({ email, password }: { email: AuthInputs["email"], password: AuthInputs["password"] }) => {
    const isValidEmail = validEmail(email);
    if (!isValidEmail.success) {
        throw new BadRequestError(isValidEmail.reason!);
    }

    const isValidPassowrd = validPassowrd(password);
    if (!isValidPassowrd.success) {
        throw new BadRequestError(isValidPassowrd.reason!);
    }
}

// validation for requesting password reset
const forgetPasswordValidation = ({ email }: { email: AuthInputs["email"] }) => {
    const isValidEmail = validEmail(email);
    if (!isValidEmail.success) {
        throw new BadRequestError(isValidEmail.reason!);
    }
}

export {
    registerInputValidations,
    loginInputValidations,
    forgetPasswordValidation
};