import { BadRequestError } from "../../../../errors";
import { isInvalidDuration } from "./queryInputsValidator";

const getValidDuration = (duration: string) => {
    const invalidDuration = isInvalidDuration(duration);
    if (invalidDuration) {
        throw new BadRequestError(invalidDuration);
    }
    return duration.toString() as "day" | "week" | "month" | "year";
}

export {
    getValidDuration
}