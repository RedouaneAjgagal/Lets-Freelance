import { getRequest } from "../../../services/api";

export type EmployerJobType = {
    _id: string;
    title: string;
    status: "open" | "closed";
    priceType: "fixed" | "hourly";
    price: {
        min: number;
        max: number;
    };
    experienceLevel: "expert" | "intermediate" | "entryLevel";
    proposals: number;
    createdAt: string;
}

type EmployerJobsType = EmployerJobType[];

const getEmployerJobs = async () => {
    const response = await getRequest("jobs/profile/employer-jobs");
    const data = await response.data as EmployerJobsType;
    return data;
}

export default getEmployerJobs;