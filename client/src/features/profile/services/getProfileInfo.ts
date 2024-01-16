import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";

export type ConnectPaymentType = {
    status: "pending" | "paid";
    sessionId: string;
    connectionsCount: number;
    amountPaid?: number;
    paidAt?: string;
}

export type ConnectsType = {
    connectionsCount: number;
    payments: ConnectPaymentType[];
}

export type FreelancerExperience = {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
}

export type FreelancerEducation = {
    title: string;
    academy: string;
    year: string;
    description: string;
}

export type FreelancerInfo = {
    dateOfBirth?: string;
    hourlyRate: string;
    jobTitle?: string;
    portfolio?: string;
    gender: string;
    englishLevel: string;
    types: string;
    skills: string[];
    education: FreelancerEducation[];
    experience: FreelancerExperience[];
    connects: ConnectsType;
}

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
        freelancer?: FreelancerInfo
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
    const response = await getRequest("profiles");
    return response;
}

export default getProfileInfo;