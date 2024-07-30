const isInvalidConnect = (connects: any | undefined) => {
    let error = "";

    if (!connects || connects.toString().trim() === "") {
        return error = "Connects is required";
    }

    if (typeof connects !== "number") {
        return error = "Invalid connects format";
    }

    if (connects < 1) {
        return error = "Cannot buy less than 1 connect";
    }

    if (connects - Math.floor(connects) !== 0) {
        return error = "Must be an integer number";
    }

    if (connects > 100) {
        return error = "Maximum to 100 connects per session";
    }

    return error;
}

export default isInvalidConnect;