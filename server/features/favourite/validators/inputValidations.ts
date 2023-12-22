import mongoose from "mongoose";

const isInvalidEvent = (event: any) => {
    if (!event || event.toString().trim() === "") {
        return "Favourite event is required";
    }

    if (typeof event !== "string") {
        return "Invalid favourite event format";
    }

    const events = ["profile", "service", "job"];
    if (!events.includes(event)) {
        return "Invalid event";
    }

    return "";
}

const isInvalidTarget = (target: any) => {
    if (!target) {
        return "Favourite target ID is required";
    }

    const isValidMongodbId = mongoose.isValidObjectId(target);
    if (!isValidMongodbId) {
        return "Invalid favourite ID";
    }

    return "";
}

export {
    isInvalidEvent,
    isInvalidTarget
}