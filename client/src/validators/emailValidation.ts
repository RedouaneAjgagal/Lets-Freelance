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

export default emailValidation;