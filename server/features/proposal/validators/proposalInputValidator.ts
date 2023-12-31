import { ProposalType } from "../proposal.model"

const isInvalidCoverLetter = (coverLetter: ProposalType["coverLetter"] | undefined) => {
    let error = "";

    if (!coverLetter || coverLetter.toString().trim() === "") {
        return error = "Cover letter is required";
    }

    if (typeof coverLetter !== "string") {
        return error = "Invalid cover letter format";
    }

    if (coverLetter.length > 3000) {
        return error = "Cover later cannot be greater than 3000 characters";
    }

    return error;
}

const isInvalidPriceType = (priceType: ProposalType["priceType"] | undefined) => {
    let error = "";

    if (!priceType || priceType.toString().trim() === "") {
        return error = "Price type is required";
    }

    if (typeof priceType !== "string") {
        return error = "Invalid type of the price type";
    }

    const priceTypeList = ["hourly", "fixed"];
    if (!priceTypeList.includes(priceType)) {
        return error = "Unsupported price type";
    }

    return error;
}

const isInvalidPrice = (price: ProposalType["price"] | undefined) => {
    let error = "";

    if (!price || price.toString().trim() === "") {
        return error = "Proposal price is required";
    }

    if (typeof price !== "number") {
        return error = "Proposal price must be a number";
    }

    if (price < 1) {
        return error = "Proposal price cannot be less than $1";
    }

    return error;
}

const isInvalidEstimatedTime = (estimatedTime: ProposalType["estimatedTime"] | undefined) => {
    let error = "";

    if (!estimatedTime) {
        return error = "Proposal estimated time is required";
    }

    if (typeof estimatedTime !== "object") {
        return error = "Invalid proposal estimated time format";
    }

    if (Object.entries(estimatedTime).length !== 2) {
        return error = "Invalid proposal estimated time format";
    }

    const isValidEstimatedTime = Object.entries(estimatedTime).every(([key, value]) => {
        if (key !== "timeType" && key !== "timeValue") {
            return false;
        }

        if (!value || value.toString().trim() === "") {
            return false;
        }
        return true;
    });

    if (!isValidEstimatedTime) {
        return error = "Invalid proposal estimated time format";
    }

    const timeTypes = ["hours", "days", "months"];
    if (!timeTypes.includes(estimatedTime.timeType)) {
        return error = "Unsupported estimated time type";
    }

    if (typeof estimatedTime.timeValue !== "number") {
        return error = "Invalid time format";
    }

    if (estimatedTime.timeValue < 1) {
        return error = "Estimated time cannot be less than 1";
    }

    return error;
}

const isInvalidStatus = (status: string | undefined) => {
    let error = "";

    if (!status || status.toString().trim() === "") {
        return error = "Proposal status is required";
    }

    if (typeof status !== "string") {
        return error = "Invalid proposal status format";
    }

    const statusList = ["pending", "interviewing", "rejected", "approved"];
    if (!statusList.includes(status)) {
        return error = "Unsupported proposal status";
    }

    return error;
}

const isInvalidConnects = (connects: ProposalType["boostProposal"]["spentConnects"] | undefined) => {
    let error = "";

    if (connects === undefined || connects.toString().trim() === "") {
        return error = "Spent connects is required";
    }

    if (typeof connects !== "number") {
        return error = "Invalid spent connects format";
    }

    if (connects < 0) {
        return error = "Spent connects cannot be less than 0";
    }

    if (connects - Math.floor(connects) !== 0) {
        return error = "Must be an integer number";
    }

    return error;
}

export {
    isInvalidCoverLetter,
    isInvalidEstimatedTime,
    isInvalidPrice,
    isInvalidPriceType,
    isInvalidStatus,
    isInvalidConnects
}