import { BadRequestError } from "../../../errors";
import { isInvalidSubject, isInvalidReason } from "./contractInputValidator"

type CancelContractValidation = {
    subject: string | undefined;
    reason: string | undefined;
}

const cancelContractValidator = ({ subject, reason }: CancelContractValidation) => {
    const invalidSubject = isInvalidSubject(subject);
    if (invalidSubject) {
        throw new BadRequestError(invalidSubject);
    }

    const invalidReason = isInvalidReason(reason);
    if (invalidReason) {
        throw new BadRequestError(invalidReason);
    }
}

export default cancelContractValidator;