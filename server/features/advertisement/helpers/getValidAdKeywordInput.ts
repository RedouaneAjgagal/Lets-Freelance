import { BadRequestError } from "../../../errors";
import { isInvalidAdKeyword } from "../validators/inputValidations"

const getValidAdKeywordInput = (keyword: string | undefined) => {
    const invalidKeyword = isInvalidAdKeyword(keyword);
    if (invalidKeyword) {
        throw new BadRequestError(invalidKeyword);
    }

    const adKeyword = keyword!.split("-").join(" ").toLowerCase();

    return adKeyword;
}

export default getValidAdKeywordInput;