import { ReviewWithoutRefs } from "../review.model";

const isInvalidActivityType = (activityType: ReviewWithoutRefs["activityType"] | undefined) => {
    let error = "";
    if (!activityType || activityType.toString().trim() === "") {
        return error = "Activity type is required";
    }

    if (typeof activityType !== "string") {
        return error = "Invalid activity type format";
    }

    const allowedActivityTypes = ["service", "job"];
    if (!allowedActivityTypes.includes(activityType)) {
        return error = "Unsupported activity type";
    }

    return error;
}

const isInvalidRating = (rating: ReviewWithoutRefs["rating"] | undefined) => {
    let error = "";
    if (!rating || rating.toString().trim() === "") {
        return error = "rating is required";
    }

    if (typeof rating !== "number") {
        return error = "Invalid rating format";
    }

    if (rating < 1) {
        return error = "rating cannot be less than 1"
    }

    if (rating > 5) {
        return error = "rating cannot be greater than 5"
    }

    return error;
}

const isInvalidDescription = (description: ReviewWithoutRefs["description"] | undefined) => {
    let error = "";

    if (description && typeof description !== "string") {
        return error = "Invalid description format";
    }

    if (description && description.trim().length > 2000) {
        return error = "Description cannot be more than 2000 characters";
    }

    return error;
}

export {
    isInvalidActivityType,
    isInvalidDescription,
    isInvalidRating
}