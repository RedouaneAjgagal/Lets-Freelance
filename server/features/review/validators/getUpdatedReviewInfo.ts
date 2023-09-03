import { BadRequestError } from "../../../errors";
import { ReviewWithoutRefs } from "../review.model"
import { isInvalidActivityType, isInvalidDescription, isInvalidRating } from "./reviewInputValidator";

type ExpectedInputs = {
    activityType: ReviewWithoutRefs["activityType"] | undefined;
} & Outputs;

type Outputs = {
    description: ReviewWithoutRefs["description"] | undefined;
    rating: ReviewWithoutRefs["rating"] | undefined;
}

const getUpdatedReviewInfo = (inputs: ExpectedInputs) => {
    const { activityType, description, rating } = inputs;

    const updatedReviewInfo: Partial<Outputs> = {};

    const invalidActivityType = isInvalidActivityType(activityType);
    if (invalidActivityType) {
        throw new BadRequestError("Activity type is required");
    }

    const invalidDescription = isInvalidDescription(description);
    if (!invalidDescription) {
        updatedReviewInfo.description = description;
    }

    const invalidRating = isInvalidRating(rating);
    if (!invalidRating) {
        updatedReviewInfo.rating = rating;
    }

    return updatedReviewInfo;
}

export default getUpdatedReviewInfo;