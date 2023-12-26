import { BadRequestError } from "../../../errors";
import { isInvalidDuration, isInvalidRating } from "./queryInputsValidator";

const getValidDuration = (duration: string) => {
    const invalidDuration = isInvalidDuration(duration);
    if (invalidDuration) {
        throw new BadRequestError(invalidDuration);
    }
    return duration.toString() as "day" | "week" | "month" | "year";
}

const getValidRating = (rating: string) => {
    const invalidRating = isInvalidRating(rating);
    if (invalidRating) {
        throw new BadRequestError(invalidRating);
    }

    return rating.toString() as "low" | "mid" | "high";
}

export {
    getValidDuration,
    getValidRating
}