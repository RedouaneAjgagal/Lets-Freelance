// check if its a valid name
const nameValidation = (name: string) => {
    if (!name || name.trim() === "") {
        return {
            isError: true,
            reason: "Please provide a name"
        }
    }
    if (name.trim().length < 3 || name.trim().length > 20) {
        return {
            isError: true,
            reason: "Must be between 3 and 20 characters"
        }
    }
    return {
        isError: false,
        reason: ""
    }
}

// check if its a valid email
const emailValidation = (email: string) => {
    if (!email || email.trim() === "") {
        return {
            isError: true,
            reason: "Please provide an email"
        }
    }
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    if (!validEmail) {
        return {
            isError: true,
            reason: "Plese provide a valid email"
        }
    }
    return {
        isError: false,
        reason: ""
    }
}

// check if its a valid poassword
const passwordValidation = (password: string) => {
    if (!password || password.trim() === "") {
        return {
            isError: true,
            reason: "Please provide a password"
        }
    }
    if (password.trim().length < 6 || password.trim().length > 60) {
        return {
            isError: true,
            reason: "Please use a long password"
        }
    }
    return {
        isError: false,
        reason: ""
    }
}

export {
    nameValidation,
    emailValidation,
    passwordValidation
}