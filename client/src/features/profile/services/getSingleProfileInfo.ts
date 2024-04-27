import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";

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
    dateOfBirth?: string;
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
    totalJobPosted: number;
    companyName?: string;
    website?: string;
}

export type OpenJobType = {
    _id: string;
    title: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    priceType: "fixed" | "hourly";
    price: {
        min: number;
        max: number;
    };
    locationType: "remote" | "onsite";
    createdAt: string;
}

type RatingType = {
    avgRate: number | undefined;
    numOfReviews: number;
}

export type GeneralProfile = {
    _id: string;
    user: string;
    name: string;
    avatar: string;
    showProfile: boolean;
    country?: string;
    phoneNumber?: number;
    description?: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    rating: RatingType;
    isFavorited: boolean;
    createdAt: string;
}

export type ServiceType = {
    _id: string;
    title: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    featuredImage: string;
    tier: {
        starter: {
            price: number;
        }
    }
    rating: RatingType;
};

type FreelancerSigleProfile = {
    userAs: "freelancer";
    roles: {
        freelancer: IFreelancerRole;
    };
    services: ServiceType[];
    projectSuccess: number;
    totalService: number;
    completedService: number;
    inQueueService: number;
}

type EmployerSignleProfile = {
    userAs: "employer";
    roles: {
        employer: IEmployerRole;
    };
    openJobs: OpenJobType[];
}

export type FreelancerProfileType = (GeneralProfile & FreelancerSigleProfile);
export type EmployerProfileType = (GeneralProfile & EmployerSignleProfile);

export type SingleProfile = FreelancerProfileType | EmployerProfileType;

type GetSingleProfileInfoPayload = {
    profileId: string;
}

const getSingleProfileInfo = async (payload: GetSingleProfileInfoPayload) => {
    const response: AxiosResponse<Promise<SingleProfile>> = await getRequest(`profiles/${payload.profileId}`);

    const data = await response.data;
    return data;
}

export default getSingleProfileInfo;