import { postRequest } from "../../../services/api"

type CreateJobPayloadType = {
    title: string;
    description: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    priceType: "hourly" | "fixed";
    price: {
        min: number;
        max: number;
    };
    locationType: "onsite" | "remote";
    duration: {
        dateType: "months" | "days" | "hours";
        dateValue: number;
    };
    weeklyHours: {
        min: number;
        max: number;
    };
    experienceLevel: "expert" | "intermediate" | "entryLevel";
    tags: string[];
}

type CreateJobReponseType = {
    msg: string;
}

const createJob = async (payload: CreateJobPayloadType) => {
    const response = await postRequest("jobs", payload);
    const data = await response.data as CreateJobReponseType;
    return data;
}

export default createJob;