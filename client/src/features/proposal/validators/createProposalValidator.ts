import {
    isInvalidCoverLetter,
    isInvalidConnects,
    isInvalidPrice,
    isInvalidTimeType,
    isInvalidTimeValue
} from "./proposalInputValidations";

type CreateProposalPayload = {
    coverLetter: string | undefined;
    timeType: string | undefined;
    timeValue: string | undefined;
    price: string | undefined;
    spentConnects: string | undefined;
};

const createProposalValidator = (payload: CreateProposalPayload) => {
    const errors = {
        price: isInvalidPrice(payload.price),
        timeType: isInvalidTimeType(payload.timeType),
        timeValue: isInvalidTimeValue(payload.timeValue),
        coverLetter: isInvalidCoverLetter(payload.coverLetter),
        spentConnects: payload.spentConnects ? isInvalidConnects(payload.spentConnects) : ""
    };

    return errors;
}

export default createProposalValidator;