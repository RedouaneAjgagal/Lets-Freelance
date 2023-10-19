import { JobTypeWithoutRefs } from "../job.model";

const isInvalidTitle = (title: JobTypeWithoutRefs["title"] | undefined) => {
    let error = "";

    if (!title || title.toString().trim() === "") {
        return error = "Job title is required";
    }

    if (typeof title !== "string") {
        return error = "Invalid title type"
    }

    if (title.length > 50) {
        return error = "Job title cannot be more than 50 characters"
    }

    return error;
}


const isInvalidDescription = (description: JobTypeWithoutRefs["description"] | undefined) => {
    let error = "";

    if (!description || description.toString().trim() === "") {
        return error = "Job description is required";
    }

    if (typeof description !== "string") {
        return error = "Invalid description type"
    }

    if (description.length > 6000) {
        return error = "Job description cannot be more than 6000 characters"
    }

    return error;
}


const isInvalidCategory = (category: JobTypeWithoutRefs["category"] | undefined) => {
    let error = "";

    if (!category || category.toString().trim() === "") {
        return error = "Job category is required";
    }

    if (typeof category !== "string") {
        return error = "Invalid category type";
    }

    const categoryList = ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"];
    if (!categoryList.includes(category)) {
        return error = "Unsupported category";
    }

    return error;
}


const isInvalidPriceType = (priceType: JobTypeWithoutRefs["priceType"] | undefined) => {
    let error = "";

    if (!priceType || priceType.toString().trim() === "") {
        return error = "Price type is required";
    }

    if (typeof priceType !== "string") {
        return error = "Invalid type of the price type";
    }

    const priceTypeList = ["hourly", "fixed"];
    if (!priceTypeList.includes(priceType)) {
        return error = "Unsupported price type";
    }

    return error;
}


const isInvalidPrice = (price: JobTypeWithoutRefs["price"] | undefined, priceType: JobTypeWithoutRefs["priceType"]) => {
    let error = "";

    if (!price) {
        return error = "Price is required";
    }

    if (typeof price !== "object") {
        return error = "Invalid price format";
    }

    const isValidPrice = Object.entries(price).length === 2 && Object.entries(price).every(([key, value]) => {
        if (key !== "min" && key !== "max") {
            return false;
        }

        if (!value || typeof value !== "number") {
            return false;
        };

        if (value < 1) {
            return false;
        }

        return true;
    });

    if (priceType === "fixed" && price.min !== price.max) {
        return error = "For fixed price job, min/max price must be the same";
    }

    if (!isValidPrice) {
        return error = "Invalid price format";
    }

    if (price.min > price.max) {
        return error = "The minimum price cannot be greater than the maximum";
    }

    if (priceType === "fixed" && price.max !== price.min) {
        return error = "For fixed price, must be the same min/max price";
    }

    return error;
}


const isInvalidLocationType = (locationType: JobTypeWithoutRefs["locationType"] | undefined) => {
    let error = "";

    if (!locationType || locationType.toString().trim() === "") {
        return error = "Location type is required";
    }

    if (typeof locationType !== "string") {
        return error = "Invalid type of location type";
    }

    const locationTypeList = ["remote", "onsite"];
    if (!locationTypeList.includes(locationType)) {
        return error = "Unsupported location type";
    }

    return error;
}


const isInvalidDuration = (duration: JobTypeWithoutRefs["duration"] | undefined) => {
    let error = "";

    // job duration is not required
    if (!duration) {
        return error = "Job duration is required";
    }

    if (typeof duration !== "object") {
        return error = "Invalid duration format";
    }

    if (!Object.entries(duration).length) {
        return error = ""
    }

    const isValidDuration = Object.entries(duration).length === 2 && Object.entries(duration).every(([key, value]) => {
        if (key !== "dateType" && key !== "dateValue") {
            return false;
        }

        if (!value || value.toString().trim() === "") {
            return false;
        }
        return true;
    });

    if (!isValidDuration) {
        return error = "Invalid duration format";
    }

    const dateTypeList = ["hours", "days", "months"];
    if (!dateTypeList.includes(duration.dateType!)) {
        return error = "Unsupported duration type";
    }

    if (typeof duration.dateValue !== "number") {
        return error = "Invalid duration value format";
    }

    if (duration.dateValue < 1) {
        return error = "Duration value cannot be less than 1";
    }

    return error;
}

const isInvalidWeeklyHours = (weeklyHours: JobTypeWithoutRefs["weeklyHours"] | undefined) => {
    let error = "";

    if (!weeklyHours) {
        return error = "Weekly hours is required";
    }

    if (typeof weeklyHours !== "object") {
        return error = "Invalid weekly hours format";
    }

    const isValidPrice = Object.entries(weeklyHours).length === 2 && Object.entries(weeklyHours).every(([key, value]) => {
        if (key !== "min" && key !== "max") {
            return false;
        }

        if (!value || typeof value !== "number") {
            return false;
        };

        if (value < 1 || value > 168) {
            return false;
        }

        return true;
    });

    if (!isValidPrice) {
        return error = "Invalid weekly hours format";
    }

    if (weeklyHours.min > weeklyHours.max) {
        return error = "Weekly hours minimum cannot be greater than maximum";
    }

    return error;
}

const isInvalidExperienceLevel = (experienceLevel: JobTypeWithoutRefs["experienceLevel"] | undefined) => {
    let error = "";

    if (!experienceLevel || experienceLevel.toString().trim() === "") {
        return error = "Experience level is required";
    }

    if (typeof experienceLevel !== "string") {
        return error = "Invalid experience level format";
    }

    const experienceLevelList = ["entryLevel", "intermediate", "expert"];
    if (!experienceLevelList.includes(experienceLevel)) {
        return error = "Unsupported experience level";
    }

    return error;
}

const isInvalidTags = (tags: JobTypeWithoutRefs["tags"] | undefined) => {
    let error = "";

    if (!tags) {
        return error = "Job tags is required";
    }

    if (!Array.isArray(tags)) {
        return error = "Invalid job's tags format";
    }

    const isValidTags = tags.every(tag => tag && typeof tag === "string" && tag.trim() !== "");
    if (!isValidTags) {
        return error = "Invalid job tags";
    }

    if (tags.length > 10) {
        return error = "Tags cannot be more than 10";
    }

    return error;
}

const isInvalidStatus = (status: JobTypeWithoutRefs["status"] | undefined) => {
    let error = "";

    if (!status || status.toString().trim() === "") {
        return error = "Job status is required";
    }

    if (typeof status !== "string") {
        return error = "Invalid job's status format";
    }

    const validStatus = ["open", "closed"];
    if (!validStatus.includes(status)) {
        return error = "Unsupported job's status";
    }

    return error;
}


export {
    isInvalidCategory,
    isInvalidDescription,
    isInvalidDuration,
    isInvalidExperienceLevel,
    isInvalidLocationType,
    isInvalidPrice,
    isInvalidPriceType,
    isInvalidTags,
    isInvalidWeeklyHours,
    isInvalidTitle,
    isInvalidStatus
}