const isEmptyValue = (value: string) => {
    if (!value || value.trim() === "") {
        return true;
    }

    return false;
}

const isInvalidName = (name: string) => {
    const isEmpty = isEmptyValue(name);
    if (isEmpty) {
        return "Campaign name is required";
    }

    return "";
}

const isInvalidBudgetType = (budgetType: string) => {
    const isEmpty = isEmptyValue(budgetType);
    if (isEmpty) {
        return "Type is required";
    }

    const budgetTypes = ["daily", "total"];
    if (!budgetTypes.includes(budgetType)) {
        return "Invalid type";
    }

    return "";
}

const isInvalidBudget = (budget: string) => {
    const isEmpty = isEmptyValue(budget);
    if (isEmpty) {
        return "Budget is required";
    }

    const budgetNumber = Number(budget);

    if (Number.isNaN(budgetNumber)) {
        return "Invalid number";
    }

    if (budgetNumber < 1) {
        return "Minimum is 1";
    }

    return "";
}

const isInvalidDate = (date: string) => {
    const isEmpty = isEmptyValue(date);
    if (isEmpty) {
        return "Starting date is required";
    }

    const timestamps = Date.parse(date);
    if (isNaN(timestamps)) {
        return "Invalid date";
    }

    return "";
}

const isInvalidStartDate = (startingDate: string) => {
    const invalidDate = isInvalidDate(startingDate);
    if (invalidDate) {
        return invalidDate;
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const startingDay = new Date(startingDate).getTime();

    if (startingDay < today) {
        return "Invalid starting date";
    }

    return "";
}


const isInvalidEndDate = (endingDate: string) => {
    const invalidDate = isInvalidDate(endingDate);
    if (invalidDate) {
        return invalidDate;
    }

    const getCurrentDate = new Date().getTime();
    const oneDayAhead = new Date(getCurrentDate + (24 * 60 * 60 * 1000)).setHours(0, 0, 0, 0);
    const getEndingDate = new Date(endingDate).getTime();
    if (oneDayAhead > getEndingDate) {
        return "Invalid ending date"
    }

    return "";
}

const isInvalidServiceId = (serviceId: string) => {
    const isEmpty = isEmptyValue(serviceId);
    if (isEmpty) {
        return "Service is required";
    }

    if (serviceId === "Select a service") {
        return "Please select a service"
    }

    return "";
}

const isInvalidEvent = (event: string) => {
    const isEmpty = isEmptyValue(event);
    if (isEmpty) {
        return "Event is required";
    }

    const events = ["cpc", "cpm"];
    if (!events.includes(event)) {
        return "Invalid event";
    }

    return ""
}

const isInvalidBidAmount = (bidAmount: string) => {
    const isEmpty = isEmptyValue(bidAmount);
    if (isEmpty) {
        return "Bid is required";
    }

    const bidAmountNumber = Number(bidAmount);
    if (Number.isNaN(bidAmountNumber)) {
        return "Invalid number";
    }

    if (bidAmountNumber < 0.1) {
        return "0.1 is the minimum";
    }

    return "";
}

const isInvalidCategory = (category: string) => {
    const isEmpty = isEmptyValue(category);
    if (isEmpty) {
        return "Category is required";
    }

    if (category.toLowerCase() === "select a category") {
        return "Please select a category";
    }

    const categories = ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"];
    if (!categories.includes(category)) {
        return "Invalid category"
    }

    return "";
}

const isInvalidKeyword = (keyword: string) => {
    const isEmpty = isEmptyValue(keyword);
    if (isEmpty) {
        return "keyword can't be empty";
    }

    return "";
}

const isInvalidKeywords = (keywords: string[]) => {
    if (keywords.length < 3) {
        return "Provide a minimum of 3 keywords"
    }

    if (keywords.length > 6) {
        return "Keywords are limited to 6"
    }

    return "";
}

const campaignInputsValidations = {
    isInvalidBidAmount,
    isInvalidBudget,
    isInvalidBudgetType,
    isInvalidCategory,
    isInvalidEndDate,
    isInvalidEvent,
    isInvalidKeyword,
    isInvalidKeywords,
    isInvalidName,
    isInvalidServiceId,
    isInvalidStartDate,
}

export default campaignInputsValidations;