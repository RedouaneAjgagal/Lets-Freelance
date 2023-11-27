import { isValidObjectId } from "mongoose";

const isInvalidName = (name: any) => {
    if (!name || name.toString().trim() === "") {
        return "Campaign name is required"
    }
    if (typeof name !== "string") {
        return "Invalid campaign name format"
    }
    return "";
}

const isInvalidBudget = (budget: any) => {
    if (!budget || budget.toString().trim() === "") {
        return "Campaign budget is required";
    }

    if (typeof budget !== "number") {
        return "Invalid campaign budget format";
    }

    if (budget < 1) {
        return "Campaign budget cannot be less than $1"
    }
    return "";
}

const isInvalidBudgetType = (budgetType: any) => {
    if (!budgetType || budgetType.toString().trim() === "") {
        return "Campaign budget type is required";
    }

    if (typeof budgetType !== "string") {
        return "Invalid campaign budget type format";
    }

    const budgetTypes = ["daily", "total"];
    if (!budgetTypes.includes(budgetType)) {
        return "Invalid budget type. Can only be 'daily' or 'total'"
    }
    return "";
}

const isInvalidDate = (date: any) => {
    if (!date || date.toString().trim() === "") {
        return "Campaign dates are required";
    }

    if (typeof date !== "string") {
        return "Invalid campaign date format";
    }

    const timestamps = Date.parse(date);
    if (isNaN(timestamps)) {
        return "Invalid date";
    }

    const getCurrentDate = new Date().getTime();
    const getDate = new Date(date).getTime();
    if (getDate < getCurrentDate) {
        return "Cannot set past dates";
    }
    return "";
}

const isInvalidStartDate = (date: any) => {
    const invalidDate = isInvalidDate(date);
    if (invalidDate) {
        return invalidDate;
    }

    return "";
}

const isInvalidEndDate = ({ startDate, endDate }: { startDate: any; endDate: any }) => {
    const invalidStartDate = isInvalidDate(startDate);
    if (invalidStartDate) {
        return invalidStartDate;
    }

    const invalidEndDate = isInvalidDate(endDate);
    if (invalidEndDate) {
        return invalidEndDate;
    }

    const getStartDate = new Date(startDate).getTime();
    const oneDayAhead = new Date(getStartDate + (24 * 60 * 60 * 1000)).getTime();
    const getEndDate = new Date(endDate).getTime();

    if (getEndDate < getStartDate) {
        return "Invalid dates"
    }

    if (oneDayAhead > getEndDate) {
        return "Invalid campaign ending date. Must be at least 24h longer from the starting date";
    }

    return "";
}

const isInvalidServiceId = (serviceId: any) => {
    if (!serviceId) {
        return "Service id is required";
    }

    const isValidMongodbId = isValidObjectId(serviceId);
    if (!isValidMongodbId) {
        return "Invalid service ID";
    }

    return "";
}

const isInvalidBidAmount = (bidAmount: any) => {
    if (!bidAmount || bidAmount.toString().trim() === "") {
        return "Bid amount is required";
    }
    if (typeof bidAmount !== "number") {
        return "Invalid Bid amount format";
    }

    if (bidAmount < 0.1) {
        return "You cannot bid with less than $0.1";
    }

    return "";
}

const isInvalidEvent = (event: any) => {
    if (!event || event.toString().trim() === "") {
        return "Event is required";
    }

    if (typeof event !== "string") {
        return "Invalid event format";
    }

    const events = ["cpc", "cpm"];
    if (!events.includes(event)) {
        return "Invalid event. Can only be 'cpc' or 'cpm'";
    }
    return ""
}

const isInvalidCategory = (category: any) => {
    if (!category || category.toString().trim() === "") {
        return "Category is required";
    }

    if (typeof category !== "string") {
        return "Invalid category format";
    }

    const categories = ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"];
    if (!categories.includes(category)) {
        return "Invalid category"
    }

    return "";
}

const isInvalidKeywords = (keywords: any) => {
    if (!keywords) {
        return "Ad keywords are required";
    }

    if (!Array.isArray(keywords)) {
        return "Invalid ad keywords format";
    }

    const errors = keywords.filter(keyword => {
        if (typeof keyword !== "string") {
            return keyword
        }
        if (keyword.trim() === "") {
            return keyword
        }
    });

    if (errors.length) {
        return "Invalid ad keywords format";
    }

    if (keywords.length < 3) {
        return "Ad keywords must be at least 3";
    }

    if (keywords.length > 6) {
        return "Ad keywords limited to 6";
    }

    return "";
}

const isInvalidCountry = (country: any) => {
    if (country === undefined) return "";

    if (country.toString().trim() === "") {
        return "Country cannot be empty";
    }

    if (typeof country !== "string") {
        return "Invalid country format";
    }

    return ""
}

const isInvalidStatus = (status: any) => {
    if (!status || status.toString().trim() === "") {
        return "Status is required";
    }

    if (typeof status !== "string") {
        return "Invalid status format";
    }

    const validStatus = ["active", "inactive"];
    if (!validStatus.includes(status)) {
        return "Invalid status"
    }

    return "";
}

const isInvalidAd = ({ ad, includeStatus }: { ad: any; includeStatus: boolean }) => {
    if (!ad) {
        return "Ad is required";
    }

    if (typeof ad !== "object") {
        return "Invalid ad format";
    }

    const invalidServiceId = isInvalidServiceId(ad.service);
    if (invalidServiceId) {
        return invalidServiceId;
    }

    const invalidBidAmount = isInvalidBidAmount(ad.bidAmount);
    if (invalidBidAmount) {
        return invalidBidAmount;
    }

    const invalidEvent = isInvalidEvent(ad.event);
    if (invalidEvent) {
        return invalidEvent;
    }

    const invalidCategory = isInvalidCategory(ad.category);
    if (invalidCategory) {
        return invalidCategory
    }

    const invalidKeywords = isInvalidKeywords(ad.keywords);
    if (invalidKeywords) {
        return invalidKeywords;
    }

    const invalidCountry = isInvalidCountry(ad.country);
    if (invalidCountry) {
        return invalidCountry;
    }

    if (includeStatus) {
        const invalidStatus = isInvalidStatus(ad.status);
        if (invalidStatus) {
            return invalidStatus;
        }
    }

    return "";
}

const isInvalidAds = ({ ads, includeStatus }: { ads: any; includeStatus: boolean }) => {
    if (!ads) {
        return "Campaign ads are required";
    }

    if (!Array.isArray(ads)) {
        return "Invalid campaign ads format";
    }

    if (!ads.length) {
        return "You must provide at least one ad";
    }

    if (ads.length > 10) {
        return "Max ads per campaign is 10";
    }

    const errors: string[] = [];

    ads.forEach(ad => {
        const invalidAd = isInvalidAd({
            ad,
            includeStatus
        });
        if (invalidAd) {
            errors.push(invalidAd);
        }
    });

    if (errors.length) {
        return errors[0];
    }

    return "";
}

const isInvalidAdKeyword = (keyword: string | undefined) => {
    if (!keyword || keyword.toString().trim() === "") {
        return "Ad keyword is required";
    }

    if (typeof keyword !== "string") {
        return "Invalid ad keyword format";
    }

    if (keyword.trim().length < 3) {
        return "Ad keyword must be at least 3 letters";
    }

    return "";
}


export {
    isInvalidName,
    isInvalidBudget,
    isInvalidBudgetType,
    isInvalidStartDate,
    isInvalidEndDate,
    isInvalidAd,
    isInvalidAds,
    isInvalidStatus,
    isInvalidBidAmount,
    isInvalidCategory,
    isInvalidCountry,
    isInvalidDate,
    isInvalidEvent,
    isInvalidKeywords,
    isInvalidServiceId,
    isInvalidAdKeyword
}