import { BadRequestError } from "../../../errors";
import { IProposal } from "../proposal.model";
import { isInvalidCoverLetter, isInvalidEstimatedTime, isInvalidPrice, isInvalidPriceType } from "./proposalInputValidator";

type ExpectedInputs = {
    coverLetter: IProposal["coverLetter"];
    priceType: IProposal["priceType"];
    price: IProposal["price"];
    estimatedTime: IProposal["estimatedTime"];
}

const createProposalValidator = (inputs: Partial<ExpectedInputs>) => {
    const { coverLetter, estimatedTime, price, priceType } = inputs;

    const invalidCoverLetter = isInvalidCoverLetter(coverLetter);
    if (invalidCoverLetter) {
        throw new BadRequestError(invalidCoverLetter);
    }

    const invalidPriceType = isInvalidPriceType(priceType);
    if (invalidPriceType) {
        throw new BadRequestError(invalidPriceType);
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