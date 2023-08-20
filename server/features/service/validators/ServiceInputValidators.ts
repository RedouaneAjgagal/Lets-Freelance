import { ServiceWithoutUser } from "../service.model"

const isInvalidTitle = (title: ServiceWithoutUser["title"] | undefined) => {
    let error = "";

    if (!title || title.toString().trim() === "") {
        return error = "Service title is required";
    }

    if (typeof title !== "string") {
        return error = "Unsupported title format"
    }

    if (title.length > 50) {
        return error = "Service title cannot be more than 50 characters";
    }

    return error;
}

const isInvalidDescription = (description: ServiceWithoutUser["description"] | undefined) => {
    let error = "";

    if (!description || description.toString().trim() === "") {
        return error = "Service description is required";
    }

    if (typeof description !== "string") {
        return error = "Unsupported description format"
    }

    if (description.length > 1000) {
        return error = "Service description cannot be more than 1000 characters"
    }

    return error;
}

const isInvalidCategory = (category: ServiceWithoutUser["category"] | undefined) => {
    let error = "";

    if (!category || category.toString().trim() === "") {
        return error = "Service Category is required";
    }

    if (typeof category !== "string") {
        return error = "Unsupported category format";
    }

    const categoryList = ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"];
    if (!categoryList.includes(category)) {
        return error = "Unsupported category";
    }

    return error;
}


const isInvalidFeaturedImage = (featuredImg: ServiceWithoutUser["featuredImage"] | undefined) => {
    let error = "";

    if (!featuredImg || featuredImg.toString().trim() === "") {
        return error = "Featured image is required";
    }

    if (typeof featuredImg !== "string") {
        return error = "Unsupported featured image format";
    }

    if (!featuredImg.startsWith("https://res.cloudinary.com/dqfrgtxde/image/upload")) {
        return error = "Unsupported image";
    }

    return error;
}


const isInvalidGallery = (gallery: ServiceWithoutUser["gallery"] | undefined) => {
    let error = "";

    if (!gallery) {
        return error = "Service gallery is messing";
    }

    const isGalleryArray = Array.isArray(gallery);
    if (!isGalleryArray) {
        return error = "Unsupported gallery format";
    }

    const isValidGallery = gallery.every(img => img.toString().trim() !== "" && img.toString().startsWith("https://res.cloudinary.com/dqfrgtxde/image/upload"));
    if (!isValidGallery) {
        return error = "Invalid gallery images"
    }

    return error;
}


const isInvalidTier = (tier: ServiceWithoutUser["tier"] | undefined) => {
    let error = "";

    if (!tier || typeof tier !== "object") {
        return error = "Service plans are required";
    }

    const plansList = ["starter", "standard", "advanced"];
    const isValidTier = Object.entries(tier).every(([key, plan]) => {

        if (!plansList.includes(key)) {
            return false;
        }

        if (typeof plan.deliveryTime !== "number" || Math.floor(plan.deliveryTime) < 0) {
            return false;
        }

        if (typeof plan.price !== "number" || Math.floor(plan.price) < 0) {
            return false;
        }

        if (!Array.isArray(plan.includedIn)) {
            return false
        }

        const isValidPackages = plan.includedIn.every(includedIn => {
            if (!includedIn.description || typeof includedIn.description !== "string" || includedIn.description.trim() === "") {
                return false;
            }

            if (!includedIn.result || includedIn.result.toString().trim() === "") {
                return false;
            }

            if (typeof includedIn.result !== "string" && typeof includedIn.result !== "number" && typeof includedIn.result !== "boolean") {
                return false;
            }

            return true;
        });

        if (!isValidPackages) {
            return false;
        }

        return true;
    });

    if (!isValidTier || Object.keys(tier).length !== 3) {
        return error = "Invalid plans"
    }

    return error;
}

export {
    isInvalidTitle,
    isInvalidCategory,
    isInvalidDescription,
    isInvalidFeaturedImage,
    isInvalidGallery,
    isInvalidTier,
}