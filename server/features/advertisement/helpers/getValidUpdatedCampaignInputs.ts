import { CampaignTypeWithoutRefs } from "../advertisement.model";
import {
    isInvalidName,
    isInvalidBudget,
    isInvalidBudgetType,
    isInvalidEndDate,
    isInvalidStatus
} from "../validators/inputValidations";

const getValidUpdatedCampaignInputs = (input: any) => {
    const updatedCampaignDetails: Partial<CampaignTypeWithoutRefs> = {};

    const invalidName = isInvalidName(input.name);
    if (!invalidName) {
        updatedCampaignDetails.name = input.name;
    }

    const invalidBudget = isInvalidBudget(input.budget);
    if (!invalidBudget) {
        updatedCampaignDetails.budget = input.budget;
    }

    const invalidBudgetType = isInvalidBudgetType(input.budgetType);
    if (!invalidBudgetType) {
        updatedCampaignDetails.budgetType = input.budgetType;
    }

    const invalidEndDate = isInvalidEndDate({
        startDate: new Date(Date.now() + 1000).toString(),
        endDate: input.endDate
    });
    if (!invalidEndDate) {
        updatedCampaignDetails.endDate = input.endDate;
    }

    const invalidStatus = isInvalidStatus(input.status);
    if (!invalidStatus) {
        updatedCampaignDetails.status = input.status;
    }

    return updatedCampaignDetails;
}

export default getValidUpdatedCampaignInputs;

