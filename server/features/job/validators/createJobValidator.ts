import { BadRequestError } from "../../../errors";
import { JobTypeWithoutRefs } from "../job.model";
import { isInvalidCategory, isInvalidDescription, isInvalidDuration, isInvalidExperienceLevel, isInvalidLocationType, isInvalidPrice, isInvalidPriceType, isInvalidTags, isInvalidTitle, isInvalidWeeklyHours } from "./jobInputValidators";

type ExpectedInputs = Partial<JobTypeWithoutRefs>


const createJobValidator = (inputs: ExpectedInputs) => {
    const { category, description, duration, experienceLevel, locationType, price, priceType, tags, title, weeklyHours } = inputs;

    const invalidTitle = isInvalidTitle(title);
    if (invalidTitle) {
        throw new BadRequestError(invalidTitle);
    }


    const invalidDescription = isInvalidDescription(description);
    if (invalidDescription) {
        throw new BadRequestError(invalidDescription);
    }

    const invalidCategory = isInvalidCategory(category);
    if (invalidCategory) {
        throw new BadRequestError(invalidCategory);
    }

    const invalidPriceType = isInvalidPriceType(priceType);
    if (invalidPriceType) {
        throw new BadRequestError(invalidPriceType);
    }

    const invalidPrice = isInvalidPrice(price);
    if (invalidPrice) {
        throw new BadRequestError(invalidPrice);
    }

    const invalidLocationType = isInvalidLocationType(locationType);
    if (invalidLocationType) {
        throw new BadRequestError(invalidLocationType);
    }

    const invalidDuration = isInvalidDuration(duration);
    if (invalidDuration) {
        throw new BadRequestError(invalidDuration);
    }

    const invalidWeeklyHours = isInvalidWeeklyHours(weeklyHours);
    if (invalidWeeklyHours) {
        throw new BadRequestError(invalidWeeklyHours);
    }

    const innvalidExperienceLevel = isInvalidExperienceLevel(experienceLevel);
    if (innvalidExperienceLevel) {
        throw new BadRequestError(innvalidExperienceLevel);
    }

    const invalidTags = isInvalidTags(tags);
    if (invalidTags) {
        throw new BadRequestError(invalidTags);
    }
}

export default createJobValidator;