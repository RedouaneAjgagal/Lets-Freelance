import { BadRequestError } from "../../../errors";
import { isInvalidAd } from "./inputValidations"

const createAdValidator = (ad: any) => {
    const invalidAd = isInvalidAd({
        ad,
        includeStatus: false
    });

    if (invalidAd) {
        throw new BadRequestError(invalidAd);
    }
}

export default createAdValidator;