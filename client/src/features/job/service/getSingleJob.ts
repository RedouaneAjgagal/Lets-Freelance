import { getRequest } from "../../../services/api"

type SingleJobProfileType = {
    _id: string;
    name: string;
    userAs: "employer";
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    country?: string;
    totalJobPosted: number;
    totalSpentOnJobs: number;
    avgHourlyRatePaid: number;
    createdAt: string;
}

export type SingleJobType = {
    _id: string;
    user: string;
    profile: SingleJobProfileType;
    title: string;
    description: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    priceType: "hourly" | "fixed";
    price: {
        min: number;
        max: number;
    };
    locationType: "remote" | "onsite";
    duration: {
        dateType: "hours" | "days" | "months";
        dateValue: number;
    };
    weeklyHours: {
        min: number;
        max: number;
    };
    experienceLevel: "expert" | "intermediate" | "entryLevel";
    connects: number;
    status: "open" | "closed";
    tags: string[];
    createdAt: string;
    updatedAt: string;
    activity: {
        totalProposals: number;
        interviewing: number;
        approved: number;
        rejected: number;
    };
};

const getSingleJob = async (jobId: string) => {
    const response = await getRequest(`jobs/${jobId}`);
    const data = await response.data as SingleJobType;
    return data;
}

export default getSingleJob;