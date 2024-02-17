import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type JobType = {
    _id: string;
    title: string;
    description: string;
    priceType: "hourly" | "fixed";
    price: {
        min: number;
        max: number;
    };
    weeklyHours: {
        min: number;
        max: number;
    };
    duration: {
        dateType: "hours" | "days" | "months";
        dateValue: number;
    };
    experienceLevel: "expert" | "intermediate" | "entryLevel";
    tags: string[];
    createdAt: string;
}

export type GetJobsResponse = {
    numOfPages: number;
    jobs: JobType[];
}

export type GetJobsPayload = {
    search?: string;
    project_price?: string;
    project_type?: string;
    project_length?: string;
    hours_per_week?: string;
    location_type?: "remote" | "onsite";
    category?: "digital-marketing" | "design-creative" | "programming-tech" | "writing-translation" | "video-animation" | "finance-accounting" | "music-audio";
    experience_level?: "expert" | "intermediate" | "entryLevel";
    page?: string;
}

const getJobs = async (payload: GetJobsPayload) => {
    const searchQueries = formatSearchQueries(payload);
    const response = await getRequest(`jobs${searchQueries}`);
    const data = await response.data as GetJobsResponse;
    return data;
}

export default getJobs;