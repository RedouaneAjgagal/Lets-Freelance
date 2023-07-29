import { IProfile } from "../profile.model";

const isValidNameInput = (name: IProfile["name"] | undefined) => {
    const isValidName = name && (name.trim().length >= 3 && name.trim().length <= 20);
    return isValidName;
}

const isValidAvatarInput = (avatar: IProfile["avatar"] | undefined) => {
    const isValidAvatar = avatar && avatar.startsWith("https://res.cloudinary.com/dqfrgtxde/image/upload");
    return isValidAvatar;
}

const isValidShowProfileInput = (showProfile: IProfile["showProfile"] | undefined) => {
    const isValidShowProfile = typeof showProfile === "boolean";
    return isValidShowProfile;
}

const isValidCountryInput = (country: IProfile["country"] | undefined) => {
    const isValidCountry = country || country?.trim() === "";
    return isValidCountry
}

const isValidPhoneNumberInput = (phoneNumber: IProfile["phoneNumber"] | undefined) => {
    const isValidPhoneNumber = phoneNumber || phoneNumber?.toString().trim() === "";
    return isValidPhoneNumber;
}

const isValidCategoryInput = (category: IProfile["category"] | undefined) => {
    const categories = ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"];
    const isValidCategory = category && categories.includes(category);
    return isValidCategory;
}

const isValidDescriptionInput = (description: IProfile["description"] | undefined) => {
    const isValidDescription = (description && description.trim().length <= 1000) || description?.trim() === "";
    return isValidDescription;
}




export {
    isValidNameInput,
    isValidAvatarInput,
    isValidCategoryInput,
    isValidCountryInput,
    isValidDescriptionInput,
    isValidPhoneNumberInput,
    isValidShowProfileInput
}