import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";

export type ProfileInfo = {
    _id: string;
    user: {
        _id: string;
        email: string;
        role: "user" | "admin" | "owner";
    }
    avatar: string;
    name: string;
    showProfile: boolean;
    country?: string;
    phoneNumber?: number;
    description?: string;
    category: string;
    roles: {
        freelancer?: {
            dateOfBirth?: string;
            hourlyRate: string;
            jobTitle?: string;
            portfolio?: string;
            gender: string;
            englishLevel: string;
            types: string;
            skills: string[];
        }
        employer?: {
            employees: string;
            companyName?: string;
            website?: string;
        }
    }
    userAs: "freelancer" | "employer";
    createdAt: string;
    updatedAt: string;
}

const getProfileInfo = async (): Promise<AxiosResponse<ProfileInfo>> => {
    const response = await getRequest("profile");
    // const data = await response.data();
    return response;
}

export default getProfileInfo;