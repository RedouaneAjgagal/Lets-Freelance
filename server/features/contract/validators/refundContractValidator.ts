import { BadRequestError } from "../../../errors";
import { isInvalidSubject, isInvalidReason } from "./contractInputValidator"

type RefundContractValidation = {
    subject: string | undefined;
    reason: string | undefined;
}

const refundContractValidator = ({ subject, reason }: RefundContractValidation) => {
    const invalidSubject = isInvalidSubject(subject);
    if (invalidSubject) {
        throw new BadRequestError(invalidSubject);
    }

    const invalidReason = isInvalidReason(reason);
    if (invalidReason) {
        throw new BadRequestError(invalidReason);
    }
}

export default refundContractValidator;