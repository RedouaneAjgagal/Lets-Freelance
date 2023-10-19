import { JobTypeWithoutRefs } from "../job.model"
import { isInvalidCategory, isInvalidDescription, isInvalidDuration, isInvalidExperienceLevel, isInvalidLocationType, isInvalidPrice, isInvalidPriceType, isInvalidTags, isInvalidTitle, isInvalidWeeklyHours, isInvalidStatus } from "../validators/jobInputValidators"

type ExpectedInputs = Partial<JobTypeWithoutRefs>

type UpdatedJobInfo = {
    inputs: ExpectedInputs,
    jobPriceType: JobTypeWithoutRefs["priceType"]
}

const getUpdatedJobInfo = ({ inputs, jobPriceType }: UpdatedJobInfo) => {
    const { category, description, duration, experienceLevel, locationType, price, priceType, tags, title, weeklyHours, status } = inputs;

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

    const getPriceType = invalidPriceType ? jobPriceType : priceType;
    const invalidPrice = isInvalidPrice(price, getPriceType!);

    if (!invalidPriceType && !invalidPrice) {
        updatedInfo.priceType = priceType;
    }

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

    const invalidStatus = isInvalidStatus(status);
    if (!invalidStatus) {
        updatedInfo.status = status;
    }

    return updatedInfo;
}

export default getUpdatedJobInfo;