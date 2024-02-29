const isInvalidTitle = (title: string | undefined) => {
    if (!title || title.toString().trim() === "") {
        return "Job title is required";
    };

    if (title.length > 50) {
        return "Title max length is 50 characters";
    }

    return "";
}

const isInvalidCategory = (category: string | undefined) => {
    if (!category || category.toString().trim() === "") {
        return "Category is required";
    }

    if (category === "Select category") {
        return "You must select job category";
    }

    const categoryList = ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"];
    if (!categoryList.includes(category)) {
        return "Unsupported category";
    }

    return "";
}

const isInvalidExperienceLevel = (experienceLevel: string | undefined) => {
    if (!experienceLevel || experienceLevel.toString().trim() === "") {
        return "Freelancer's experience level is required";
    }

    const experienceLevelList = ["entryLevel", "intermediate", "expert"];
    if (!experienceLevelList.includes(experienceLevel)) {
        return "Unsupported experience level";
    }

    return "";
}


const isInvalidDescription = ({ description, plainDescription }: { description: string | undefined; plainDescription: string | undefined }) => {
    if (!plainDescription || plainDescription.toString().trim() === "" || !description) {
        return "Job description is required";
    }

    if (description.length > 6000) {
        return "Description max length is 6000 characters";
    }

    return "";
}

const isInvalidLocationType = (locationType: string | undefined) => {
    if (!locationType || locationType.toString().trim() === "") {
        return "Job location type is required";
    }

    const locationTypeList = ["remote", "onsite"];
    if (!locationTypeList.includes(locationType)) {
        return "Unsupported job location";
    }

    return "";
}

const isInvalidTags = (tags: string[] | undefined) => {
    if (!tags) {
        return "Job tags are required";
    }

    const isValidTags = tags.every(tag => tag && typeof tag === "string" && tag.trim() !== "");
    if (!isValidTags) {
        return "Invalid job tags";
    }

    if (tags.length > 10) {
        return "Maximum job tags is 10";
    }

    return "";
}

const isInvalidPriceType = (priceType: string | undefined) => {
    if (!priceType || priceType.toString().trim() === "") {
        return "Please select project price type";
    }

    const priceTypeList = ["hourly", "fixed"];
    if (!priceTypeList.includes(priceType)) {
        return "Unsupported project price type";
    }

    return "";
}

const isInvalidPrice = ({ price, priceType }: { price: { min: string | undefined; max: string | undefined }; priceType: "hourly" | "fixed" }) => {
    const min = Number(price.min);
    const max = Number(price.max);

    const isInvalidMinNumber = isNaN(min);
    const isInvalidMaxNumber = isNaN(max);

    if (isInvalidMinNumber || isInvalidMaxNumber) {
        return "Invalid price number";
    }

    if (min < 1) {
        return "Job price cannot be less than 1";
    }

    if (priceType === "hourly") {
        if (min > max) {
            return "The minimum price cannot be greater than the maximum"
        }
    } else {
        if (min !== max) {
            return "Invalid project budget number"
        }
    }

    return "";
}

const isInvalidWeeklyHours = (weeklyHours: { min: string | undefined; max: string | undefined }) => {
    const min = Number(weeklyHours.min);
    const max = Number(weeklyHours.max);

    const isInvalidMinNumber = isNaN(min);
    const isInvalidMaxNumber = isNaN(max);

    if (isInvalidMinNumber || isInvalidMaxNumber) {
        return "Invalid Weekly hours number";
    }

    if (min < 1) {
        return "Weekly hours cannot be less than 1";
    }

    if (max > 168) {
        return "Weekly hours cannot be more than 168";
    }

    if (min > max) {
        return "The minimum hours cannot be greater than the maximum"
    }

    return "";
}

const isInvalidDuration = (duration: { dateType: string | undefined; dateValue: string | undefined }) => {
    if (duration.dateValue === undefined) {
        return "Job duration is required";
    }

    const durationNumber = Number(duration.dateValue);

    const isInvalidDurationNumber = isNaN(durationNumber);
    if (isInvalidDurationNumber) {
        return "Invalid duration number";
    }

    if (durationNumber < 1) {
        return "Job Duration cannot be less than 1";
    }

    if (!duration.dateType || duration.dateType.toString().trim() === "") {
        return "Job duration type is required";
    }

    const validDurationTypes = ["hours", "days", "months"];
    if (!validDurationTypes.includes(duration.dateType)) {
        return "Unsupported duration type";
    }

    return "";
}

const createJobValidationStepOne = ({ title, category, experienceLevel }: { title: string | undefined; category: string | undefined; experienceLevel: string | undefined }) => {
    const invalidTitle = isInvalidTitle(title);
    const invalidCategory = isInvalidCategory(category);
    const invalidExperienceLevel = isInvalidExperienceLevel(experienceLevel);

    return {
        title: invalidTitle,
        category: invalidCategory,
        experienceLevel: invalidExperienceLevel
    }
}

const createJobValidationStepTwo = ({ description, plainDescription, locationType, tags }: {
    description: string | undefined,
    plainDescription: string | undefined,
    locationType: string | undefined,
    tags: string[] | undefined
}) => {

    const invalidDescription = isInvalidDescription({
        description,
        plainDescription
    });
    const invalidLocationType = isInvalidLocationType(locationType);
    const invalidTags = isInvalidTags(tags);

    return {
        description: invalidDescription,
        locationType: invalidLocationType,
        tags: invalidTags
    }
}

const createJobValidationStepThree = ({ priceType, price }: {
    priceType: string | undefined;
    price: { min: string | undefined; max: string | undefined }
}) => {
    const invalidPriceType = isInvalidPriceType(priceType);
    const invalidPrice = isInvalidPrice({
        price,
        priceType: priceType as "hourly" | "fixed"
    });

    return {
        priceType: invalidPriceType,
        price: invalidPrice
    }
}

const createJobValidationStepFour = ({ weeklyHours, duration }: {
    weeklyHours: {
        min: string | undefined;
        max: string | undefined
    };
    duration: {
        dateType: string | undefined;
        dateValue: string | undefined
    }
}) => {
    const invalidWeeklyHours = isInvalidWeeklyHours(weeklyHours);
    const invalidDuration = isInvalidDuration(duration);

    return {
        weeklyHours: invalidWeeklyHours,
        duration: invalidDuration
    }
}

export {
    createJobValidationStepOne,
    createJobValidationStepTwo,
    createJobValidationStepThree,
    createJobValidationStepFour
}