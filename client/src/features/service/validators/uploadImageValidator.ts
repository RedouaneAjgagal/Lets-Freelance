const uploadImageValidator = (img: File | null | undefined) => {
    const MAX_SIZE = 1024 * 1024;

    const result = {
        isError: true,
        error: ""
    };

    if (!img) {
        return result;
    }

    if (!img?.type.startsWith("image")) {
        result.error = "Only images are supported";
        return result;
    }

    if (img.type.startsWith("image/svg")) {
        result.error = "SVGs are not supported";
        return result;
    }

    if (img.size > MAX_SIZE) {
        result.error = "Image is too large";
        return result;
    }

    result.isError = false;
    return result;
};

export default uploadImageValidator;