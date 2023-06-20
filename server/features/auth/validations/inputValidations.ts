import { BadRequestError, UnauthorizedError } from "../../../errors";

export type AuthInputs = {
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;
    userAs: "freelancer" | "client" | undefined;
    token?: string;
}

// check if its a valid name
const nameValidation = (name: AuthInputs["name"]) => {
    if (!name || name.trim() === "") {
        throw new BadRequestError("Name is required.");
    }
    if (name.trim().length < 3 || name.trim().length > 20) {
        throw new BadRequestError("Name must be between 3 and 20 characters.");
    }
}

// check if its a valid email
const emailValidation = (email: AuthInputs["email"]) => {
    if (!email || email.trim() === "") {
        throw new BadRequestError("Email is required.");
    }
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    if (!validEmail) {
        throw new BadRequestError("Invalid email.");
    }
}

// check if its a valid poassword
const passwordValidation = (password: AuthInputs["password"]) => {
    if (!password || password.trim() === "") {
        throw new BadRequestError("Password is required.");
    }
    if (password.trim().length < 6 || password.trim().length > 60) {
        throw new BadRequestError("Password must be between 6 and 60 characters.");
    }
}

// check if its a valid role
const roleValidation = (userAs: AuthInputs["userAs"]) => {
    if (!userAs || userAs.trim() === "") {
        throw new BadRequestError("Role is required.");
    }
    if (userAs !== "freelancer" && userAs !== "client") {
        throw new UnauthorizedError("Can only be Freelancer or Client.");
    }
}

// check if its a valid token 
const tokenValidation = (token: AuthInputs["token"]) => {
    if (!token || token.trim() === "") {
        throw new BadRequestError("Token is required.");
    }
}

export {
    nameValidation,
    emailValidation,
    passwordValidation,
    roleValidation,
    tokenValidation
}