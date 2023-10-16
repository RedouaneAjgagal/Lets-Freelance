import { BadRequestError } from "../../../errors";
import { ProposalType } from "../proposal.model";
import { isInvalidConnects, isInvalidCoverLetter, isInvalidEstimatedTime, isInvalidPrice } from "./proposalInputValidator";

type ExpectedInputs = {
    coverLetter: ProposalType["coverLetter"];
    priceType: ProposalType["priceType"];
    price: ProposalType["price"];
    estimatedTime: ProposalType["estimatedTime"];
    spentConnects: ProposalType["boostProposal"]["spentConnects"];
}

const createProposalValidator = (inputs: Partial<ExpectedInputs>) => {
    const { coverLetter, estimatedTime, price, spentConnects } = inputs;

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

    const invalidSpentConnects = isInvalidConnects(spentConnects);
    if (invalidSpentConnects) {
        throw new BadRequestError(invalidSpentConnects);
    }
}

export default createProposalValidator;