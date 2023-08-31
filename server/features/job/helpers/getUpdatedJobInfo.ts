import { JobTypeWithoutRefs } from "../job.model"
import { isInvalidCategory, isInvalidDescription, isInvalidDuration, isInvalidExperienceLevel, isInvalidLocationType, isInvalidPrice, isInvalidPriceType, isInvalidTags, isInvalidTitle, isInvalidWeeklyHours } from "../validators/jobInputValidators"

type ExpectedInputs = Partial<JobTypeWithoutRefs>

type UpdatedJobInfo = {
    inputs: ExpectedInputs,
    jobPriceType: JobTypeWithoutRefs["priceType"]
}

const getUpdatedJobInfo = ({ inputs, jobPriceType }: UpdatedJobInfo) => {
    const { category, description, duration, experienceLevel, locationType, price, priceType, tags, title, weeklyHours } = inputs;

    const updatedInfo: Partial<JobTypeWithoutRefs> = {}

    const invalidTitle = isInvalidTitle(title);
    if (!invalidTitle) {
        updatedInfo.title = title;
    }

    const invalidDescription = isInvalidDescription(description);
    if (!invalidDescription) {
        updatedInfo.description = description;
    }

    const invalidCategory = isInvalidCategory(category);
    if (!invalidCategory) {
        updatedInfo.category = category;
    }

    const invalidPriceType = isInvalidPriceType(priceType);
    if (!invalidPriceType) {
        updatedInfo.priceType = priceType;
    }

    const getPriceType = invalidPriceType ? jobPriceType : priceType;
    const invalidPrice = isInvalidPrice(price, getPriceType!);
    if (!invalidPrice) {
        updatedInfo.price = price;
    }

    const invalidLocationType = isInvalidLocationType(locationType);
    if (!invalidLocationType) {
        updatedInfo.locationType = locationType;
    }

    const invalidDuration = isInvalidDuration(duration);
    if (!invalidDuration) {
        updatedInfo.duration = duration;
    }

    const invalidWeeklyHours = isInvalidWeeklyHours(weeklyHours);
    if (!invalidWeeklyHours) {
        updatedInfo.weeklyHours = weeklyHours;
    }

    const invalidExperienceLevel = isInvalidExperienceLevel(experienceLevel);
    if (!invalidExperienceLevel) {
        updatedInfo.experienceLevel = experienceLevel;
    }

    const invalidTags = isInvalidTags(tags);
    if (!invalidTags) {
        updatedInfo.tags = tags;
    }

    return updatedInfo;
}

export default getUpdatedJobInfo;