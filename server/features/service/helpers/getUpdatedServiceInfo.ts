import { ServiceWithoutRefs } from "../service.model";
import { isInvalidTitle, isInvalidCategory, isInvalidDescription, isInvalidFeaturedImage, isInvalidGallery, isInvalidTier } from "../validators/serviceInputValidators";

type ExpectedInputs = Partial<ServiceWithoutRefs>

const getUpdatedServiceInfo = (inputs: ExpectedInputs) => {
    const { title, description, category, featuredImage, gallery, tier } = inputs;

    const updatedServiceInfo: Partial<ServiceWithoutRefs> = {}

    const invalidTitle = isInvalidTitle(title);
    if (!invalidTitle) {
        updatedServiceInfo.title = title;
    }

    const invalidDescription = isInvalidDescription(description);
    if (!invalidDescription) {
        updatedServiceInfo.description = description;
    }

    const invalidCategory = isInvalidCategory(category);
    if (!invalidCategory) {
        updatedServiceInfo.category = category;
    }

    const invalidFeaturedImage = isInvalidFeaturedImage(featuredImage);
    if (!invalidFeaturedImage) {
        updatedServiceInfo.featuredImage = featuredImage;
    }

    const invalidGallery = isInvalidGallery(gallery);
    if (!invalidGallery) {
        updatedServiceInfo.gallery = gallery;
    }

    const invalidTier = isInvalidTier(tier);
    if (!invalidTier) {
        updatedServiceInfo.tier = tier;
    }

    return updatedServiceInfo;
}

export default getUpdatedServiceInfo;