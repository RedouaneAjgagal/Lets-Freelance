const isInvalidSubject = (subject: string | undefined) => {
    let error = "";

    if (!subject || subject.toString().trim() === "") {
        return error = "Cancelation subject is required";
    }

    if (typeof subject !== "string") {
        return error = "Invalid cancelation subject format";
    }

    return error;
}

const isInvalidReason = (reason: string | undefined) => {
    let error = "";

    if (!reason || reason.toString().trim() === "") {
        return error = "Cancelation reason is required";
    }

    if (typeof reason !== "string") {
        return error = "Invalid reason subject format";
    }

    if (reason.length > 5000) {
        return error = "Reason cannot be more than 5000 characters";
    }

    return error;
}

export {
    isInvalidSubject,
    isInvalidReason
}