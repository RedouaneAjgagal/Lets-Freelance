import { BadRequestError } from "../../../errors";
import { ReviewWithoutRefs } from "../review.model"
import { isInvalidActivityType, isInvalidDescription, isInvalidRating } from "./reviewInputValidator";

type ExpectedInputs = Partial<ReviewWithoutRefs> & { activityId: string | undefined };

const createReviewValidator = (inputs: ExpectedInputs) => {
    const { activityType, description, rating } = inputs;

    const invalidActivityType = isInvalidActivityType(activityType);
    if (invalidActivityType) {
        throw new BadRequestError(invalidActivityType);
    }

    const invalidDescription = isInvalidDescription(description);
    if (invalidDescription) {
        throw new BadRequestError(invalidDescription);
    }

    const invalidRating = isInvalidRating(rating);
    if (invalidRating) {
        throw new BadRequestError(invalidRating);
    }

    return {
        activityType: activityType!,
        rating: rating!,
        description
    }
}

export default createReviewValidator;