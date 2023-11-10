import { BadRequestError } from "../../../errors";
import {
    isInvalidName,
    isInvalidAds,
    isInvalidBudget,
    isInvalidBudgetType,
    isInvalidEndDate,
    isInvalidStartDate
} from "./inputValidations"

const createCampaignValidator = (input: any) => {
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

    const invalidStartDate = isInvalidStartDate(input.startDate);
    if (invalidStartDate) {
        throw new BadRequestError(invalidStartDate);
    }

    const invalidEndDate = isInvalidEndDate({
        startDate: input.startDate,
        endDate: input.endDate
    });
    if (invalidEndDate) {
        throw new BadRequestError(invalidEndDate);
    }

    const invalidAds = isInvalidAds(input.ads);
    if (invalidAds) {
        throw new BadRequestError(invalidAds);
    }
}

export default createCampaignValidator;