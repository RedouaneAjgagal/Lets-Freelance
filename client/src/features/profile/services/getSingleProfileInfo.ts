import { getRequest } from "../../../services/api";

// type GeneralDummyDetails = {
//     rating: number;
//     completedJobs: { title: string; content: string; rate: number }[];
// }

export type Freelancer = {
    serviceDetail: {
        projectSuccess: number;
        totalService: number;
        completedService: number;
        inQueueService: number;
    };
    services: {
        _id: string;
        img: string;
        category: string;
        title: string;
        rate: number;
        reviews: number;
        user: {
            img: string;
            name: string;
        };
        price: number;
    }[];
    inProgressJobs: {
        title: string,
        startDate: string
    }[];
}

export type Employer = {
    openJobs: {
        _id: string;
        title: string;
        location: string;
        category: string;
        price: { start: number; end: number } | number;
        jobType: string;
        employer: {
            name: string;
        }
    }[];
}

export interface IFreelancerRole {
    dateOfBirth?: Date;
    hourlyRate: number;
    jobTitle?: string;
    portfolio?: string;
    gender: "male" | "female";
    englishLevel: "basic" | "conversational" | "fluent" | "native" | "professional";
    types: "agency freelancers" | "independent freelancers" | "single freelancer";
    skills: string[];
    education: {
        title: string;
        academy: string;
        year: string;
        description: string
    }[];
    experience: {
        title: string;
        company: string;
        startDate: string;
        endDate: string;
        description: string;
    }[];
}

export interface IEmployerRole {
    employees: number;
    companyName?: string;
    website?: string;
}

export type GeneralProfile = {
    _id: string;
    user: {
        _id: string;
        role: "user" | "admin" | "owner";
    };
    name: string;
    avatar: string;
    showProfile: boolean;
    userAs: "freelancer" | "employer";
    country?: string;
    phoneNumber?: number;
    description?: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    roles: {
        freelancer: IFreelancerRole | undefined;
        employer: IEmployerRole | undefined;
    };
    rating: number;
    completedJobs: {
        title: string;
        content: string;
        rate: number;
        startDate: string;
        endDate: string
    }[];
}

export type SingleProfile = GeneralProfile & (Freelancer | Employer)

const getSingleProfileInfo = async (profileId: string): Promise<SingleProfile> => {
    const response = await getRequest(`profile/${profileId}`);
    const data = await response.data;
    return data;
}

export default getSingleProfileInfo;