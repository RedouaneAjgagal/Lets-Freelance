import { BadRequestError } from "../../../errors";
import { ServiceWithoutUser, IService, IncludedIn, ServicePlan, ServiceTier } from "../service.model";
import { isInvalidCategory, isInvalidDescription, isInvalidFeaturedImage, isInvalidGallery, isInvalidTier, isInvalidTitle } from "./ServiceInputValidators";

type ExpectedInputs = Partial<ServiceWithoutUser>

const createServiceValidator = (inputs: ExpectedInputs) => {
    const { title, description, category, featuredImage, gallery, tier } = inputs;

    const invalidTitle = isInvalidTitle(title);
    if (invalidTitle) {
        throw new BadRequestError(invalidTitle);
    }

    const invalidDescription = isInvalidDescription(description);
    if (invalidDescription) {
        throw new BadRequestError(invalidDescription);
    }

    const invalidCategory = isInvalidCategory(category);
    if (invalidCategory) {
        throw new BadRequestError(invalidCategory);
    }

    const invalidFeaturedImage = isInvalidFeaturedImage(featuredImage);
    if (invalidFeaturedImage) {
        throw new BadRequestError(invalidFeaturedImage);
    }

    const invalidGallery = isInvalidGallery(gallery);
    if (invalidGallery) {
        throw new BadRequestError(invalidGallery);
    }

    const invalidTier = isInvalidTier(tier);
    if (invalidTier) {
        throw new BadRequestError(invalidTier);
    }
}

export default createServiceValidator;