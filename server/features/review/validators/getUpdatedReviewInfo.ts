import { BadRequestError } from "../../../errors";
import { ReviewWithoutRefs } from "../review.model"
import { isInvalidActivityType, isInvalidDescription, isInvalidRating } from "./reviewInputValidator";

type ExpectedInputs = {
    description: ReviewWithoutRefs["description"] | undefined;
    rating: ReviewWithoutRefs["rating"] | undefined;
};

const getUpdatedReviewInfo = (inputs: ExpectedInputs) => {
    const { description, rating } = inputs;

    const updatedReviewInfo: Partial<ExpectedInputs> = {};

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