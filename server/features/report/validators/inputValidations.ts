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

export {
    isInvalidEvent,
    isInvalidTarget,
    isInvalidSubject,
    isInvalidMessage
}