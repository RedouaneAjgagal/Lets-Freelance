import { BadRequestError } from "../../../errors";
import { ReviewWithoutRefs } from "../review.model"
import { isInvalidActivityType, isInvalidDescription, isInvalidRating } from "./reviewInputValidator";

type ExpectedInputs = {
    description: ReviewWithoutRefs["description"];
    rating: ReviewWithoutRefs["rating"];
}

const createReviewValidator = ({ description, rating }: ExpectedInputs) => {
    const invalidDescription = isInvalidDescription(description);
    if (invalidDescription) {
        throw new BadRequestError(invalidDescription);
    }

    const invalidRating = isInvalidRating(rating);
    if (invalidRating) {
        throw new BadRequestError(invalidRating);
    }

    return {
        rating,
        description
    }
}

export default createReviewValidator;