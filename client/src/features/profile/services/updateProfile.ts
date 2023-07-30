import { AxiosResponse } from "axios";
import { patchRequest } from "../../../services/api";

export type UpdatedProfileData = {
    profileInfo: {
        avatar: string;
        avatarUploader: string;
        name: string;
        showProfile: boolean;
        country: string;
        phoneNumber: number;
        description: string;
        category: string;
        roles: {
            freelancer: {
                dateOfBirth: string;
                hourlyRate: string;
                jobTitle: string;
                portfolio: string;
                gender: string;
                englishLevel: string;
                types: string;
                skills: string[];
            } | undefined,
            employer: {
                employees: string;
                companyName: string;
                website: string;
            } | undefined
        }
    }
}

const updateProfile = async (updatedProfileData: UpdatedProfileData): Promise<AxiosResponse<{ msg: string }>> => {
    const response = await patchRequest("profile", updatedProfileData);
    // const data = await response.data();
    return response;
}

export default updateProfile;