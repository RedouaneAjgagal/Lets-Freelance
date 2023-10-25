import { IProfile } from "../profile.model";

const profileCompletionValidator = (profile: IProfile) => {
    if (
        !profile.category ||
        !profile.country ||
        !profile.phoneNumber ||
        !profile.description ||
        !profile.roles.freelancer?.dateOfBirth ||
        !profile.roles.freelancer?.jobTitle ||
        !profile.roles.freelancer?.skills?.length
    ) return false;

    return true;
}

export default profileCompletionValidator;