import mongoose from "mongoose";

const isInvalidEvent = (event: any) => {
    if (!event || event.toString().trim() === "") {
        return "Report event is required";
    }

    if (typeof event !== "string") {
        return "Invalid report event format";
    }

    const events = ["profile", "service", "job"];
    if (!events.includes(event)) {
        return "Invalid event";
    }

    return "";
}

const isInvalidTarget = (target: any) => {
    if (!target) {
        return "Report target ID is required";
    }

    const isValidMongodbId = mongoose.isValidObjectId(target);
    if (!isValidMongodbId) {
        return "Invalid target ID";
    }

    return "";
}

const isInvalidSubject = (subject: any) => {
    if (!subject || subject.toString().trim() === "") {
        return "Report subject is required";
    }

    if (typeof subject !== "string") {
        return "Invalid report subject format";
    }

    if (subject.length > 50) {
        return "Report subject cannot be more than 50 letters";
    }

    return "";
}


const isInvalidMessage = (message: any) => {
    if (!message || message.toString().trim() === "") {
        return "Report message is required";
    }

    if (typeof message !== "string") {
        return "Invalid report message format";
    }

    if (message.length > 500) {
        return "Report message cannot be more than 500 letters";
    }

    return "";
}


const isInvalidDuration = (duration: any) => {
    if (!duration || duration.toString().trim() === "") {
        return "Report duration is required";
    }

    if (typeof duration !== "string") {
        return "Invalid report duration format";
    }

    const validDurations = ["day", "week", "month", "year"];
    if (!validDurations.includes(duration)) {
        return "Invalid duration. Can only be `day`, `week`, `month`, or `year`";
    }

    return "";
}

const isInvalidSorting = (sort: any) => {
    if (!sort || sort.toString().trim() === "") {
        return "Sorting is required";
    }

    if (typeof sort !== "string") {
        return "Invalid sorting format";
    }

    const validSorting = ["newest", "oldest"];
    if (!validSorting.includes(sort)) {
        return "Invalid duration. Can only be `newest` or `oldest`";
    }

    return "";
}

export {
    isInvalidEvent,
    isInvalidTarget,
    isInvalidSubject,
    isInvalidMessage,
    isInvalidDuration,
    isInvalidSorting
}