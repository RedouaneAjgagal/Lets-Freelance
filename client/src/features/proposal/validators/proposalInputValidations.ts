const isInvalidCoverLetter = (coverLetter: string | undefined) => {
    const MAX_LENGTH = 3000;

    if (!coverLetter || coverLetter.trim() === "") {
        return "Cover letter is required";
    }

    if (coverLetter.length > MAX_LENGTH) {
        return `Cover letter is limited to ${MAX_LENGTH} characters`;
    }

    return "";
}

const isInvalidPrice = (price: string | undefined) => {
    if (!price || price.trim() === "") {
        return "Budget is required";
    }

    const getPrice = Number(price);

    const isInvalidNumber = Number.isNaN(getPrice);
    if (isInvalidNumber) {
        return "Invalid number";
    }

    if (getPrice < 1) {
        return "Budget cannot be less than $1";
    }

    return "";
}

const isInvalidTimeType = (timeType: string | undefined) => {
    if (!timeType) {
        return "Duration type is required";
    }

    const durationTypes = ["hours", "days", "months"];
    if (!durationTypes.includes(timeType)) {
        return "Invalid duration type";
    }

    return "";
}

const isInvalidTimeValue = (timeValue: string | undefined) => {
    if (!timeValue || timeValue.trim() === "") {
        return "Duration value is required";
    }

    const getTimeValue = Number(timeValue);

    const isInvalidNumber = Number.isNaN(getTimeValue);
    if (isInvalidNumber) {
        return "Invalid number";
    }

    if (getTimeValue < 1) {
        return "Duration value cannot be less than 1";
    }

    return "";
}

const isInvalidConnects = (connects: string | undefined) => {
    if (!connects || connects.trim() === "") {
        return "Connects amount is required";
    }

    const getConnectsAmount = Number(connects);

    const isInvalidNumber = Number.isNaN(getConnectsAmount);
    if (isInvalidNumber) {
        return "Invalid number";
    }

    if (getConnectsAmount < 1) {
        return "Connects amount cannot be less than 1";
    }

    const isInteger = Number.isInteger(getConnectsAmount);
    if (!isInteger) {
        return "Connects amount should be an integer number"
    }

    return "";
}

export {
    isInvalidCoverLetter,
    isInvalidPrice,
    isInvalidTimeType,
    isInvalidTimeValue,
    isInvalidConnects
}