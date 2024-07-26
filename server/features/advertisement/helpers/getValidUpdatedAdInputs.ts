import { AdType, AdTypeWithoutRefs } from "../advertisement.model";
import { isInvalidBidAmount, isInvalidCategory, isInvalidCountry, isInvalidEvent, isInvalidKeywords, isInvalidServiceId, isInvalidStatus } from "../validators/inputValidations";

const getValidUpdatedAdInputs = (input: any) => {
    const updatedAdDetails: Partial<AdTypeWithoutRefs & { service: string }> = {}

    const invalidServiceId = isInvalidServiceId(input.service);
    if (!invalidServiceId) {
        updatedAdDetails.service = input.service;
    }

    const invalidBidAmount = isInvalidBidAmount(input.bidAmount);
    if (!invalidBidAmount) {
        updatedAdDetails.bidAmount = input.bidAmount;
    }

    const invalidEvent = isInvalidEvent(input.event);
    if (!invalidEvent) {
        updatedAdDetails.event = input.event;
    }

    const invalidCategory = isInvalidCategory(input.category);
    if (!invalidCategory) {
        updatedAdDetails.category = input.category;
    }

    const invalidKeywords = isInvalidKeywords(input.keywords);
    if (!invalidKeywords) {
        updatedAdDetails.keywords = (input.keywords as string[]).map(keyword => keyword.toLowerCase());
    }

    const invalidCountry = isInvalidCountry(input.country);
    if (!invalidCountry) {
        updatedAdDetails.country = input.country;
    }

    const invalidStatus = isInvalidStatus(input.status);
    if (!invalidStatus) {
        updatedAdDetails.status = input.status;
    }

    return updatedAdDetails;
}

export default getValidUpdatedAdInputs;