import { BadRequestError } from "../../../errors";
import {
    isInvalidName,
    isInvalidAds,
    isInvalidBudget,
    isInvalidBudgetType,
    isInvalidEndDate,
    isInvalidStatus
} from "./inputValidations";

const updateCampaignValidator = (input: any) => {
    const invalidName = isInvalidName(input.name);
    if (invalidName) {
        throw new BadRequestError(invalidName);
    }

    const invalidBudget = isInvalidBudget(input.budget);
    if (invalidBudget) {
        throw new BadRequestError(invalidBudget);
    }

    const invalidBudgetType = isInvalidBudgetType(input.budgetType);
    if (invalidBudgetType) {
        throw new BadRequestError(invalidBudgetType);
    }

    const invalidEndDate = isInvalidEndDate({
        startDate: new Date(),
        endDate: input.endDate
    });
    if (invalidEndDate) {
        throw new BadRequestError(invalidEndDate);
    }

    const invalidStatus = isInvalidStatus(input.status);
    if (invalidStatus) {
        throw new BadRequestError(invalidStatus);
    }

    const invalidAds = isInvalidAds({
        ads: input.ads,
        includeStatus: true
    });
    if (invalidAds) {
        throw new BadRequestError(invalidAds);
    }
}

export default updateCampaignValidator;