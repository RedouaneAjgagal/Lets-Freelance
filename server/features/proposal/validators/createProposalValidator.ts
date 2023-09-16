import { BadRequestError } from "../../../errors";
import { ProposalType } from "../proposal.model";
import { isInvalidCoverLetter, isInvalidEstimatedTime, isInvalidPrice, isInvalidPriceType } from "./proposalInputValidator";

type ExpectedInputs = {
    coverLetter: ProposalType["coverLetter"];
    priceType: ProposalType["priceType"];
    price: ProposalType["price"];
    estimatedTime: ProposalType["estimatedTime"];
}

const createProposalValidator = (inputs: Partial<ExpectedInputs>) => {
    const { coverLetter, estimatedTime, price } = inputs;

    const invalidCoverLetter = isInvalidCoverLetter(coverLetter);
    if (invalidCoverLetter) {
        throw new BadRequestError(invalidCoverLetter);
    }

    const invalidPrice = isInvalidPrice(price);
    if (invalidPrice) {
        throw new BadRequestError(invalidPrice);
    }

    const invalidEstimatedTime = isInvalidEstimatedTime(estimatedTime);
    if (invalidEstimatedTime) {
        throw new BadRequestError(invalidEstimatedTime);
    }
}

export default createProposalValidator;