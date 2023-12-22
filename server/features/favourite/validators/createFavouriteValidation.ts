import { BadRequestError } from "../../../errors";
import { FavoutiteWithRefs, FavoutiteType } from "../favourite.model";
import { isInvalidEvent, isInvalidTarget } from "./inputValidations";

type CreateFavouriteInputs = Partial<FavoutiteWithRefs & { target: FavoutiteType["target"] }>;

const createFavouriteValidation = (inputs: CreateFavouriteInputs) => {
    const invalidEvent = isInvalidEvent(inputs.event);
    if (invalidEvent) {
        throw new BadRequestError(invalidEvent);
    }

    const invalidTarget = isInvalidTarget(inputs.target);
    if (invalidTarget) {
        throw new BadRequestError(invalidTarget);
    }

    return {
        event: inputs.event!,
        target: inputs.target!
    }
}

export default createFavouriteValidation;