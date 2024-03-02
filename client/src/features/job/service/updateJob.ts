import { patchRequest } from "../../../services/api"

type UpdateJobPayloadType = {
    status?: "open" | "closed";
    title?: string;
    description?: string;
    category?: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    priceType?: "hourly" | "fixed";
    price?: {
        min: number;
        max: number;
    };
    locationType?: "onsite" | "remote";
    duration?: {
        dateType: "months" | "days" | "hours";
        dateValue: number;
    };
    weeklyHours?: {
        min: number;
        max: number;
    };
    experienceLevel?: "expert" | "intermediate" | "entryLevel";
    tags?: string[];
}

type UpdateJobReponseType = {
    msg: string;
}

const updateJob = async ({ jobId, payload }: { jobId: string; payload: UpdateJobPayloadType }) => {
    const response = await patchRequest(`jobs/${jobId}`, payload);
    const data = await response.data as UpdateJobReponseType;
    return data;
}

export default updateJob;