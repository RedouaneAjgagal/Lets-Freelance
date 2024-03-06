import { getRequest } from "../../../services/api";

export type GetEmployerJobProposalType = {
    _id: string;
    user: string;
    profile: {
        _id: string;
        name: string;
        avatar: string;
    };
    coverLetter: string;
    priceType: "fixed" | "hourly";
    price: number;
    status: "pending" | "interviewing" | "rejected" | "approved";
    estimatedTime: {
        timeType: "hours" | "days" | "months";
        timeValue: number;
    };
    isBoostedProposal: boolean;
    createdAt: string;
};

type GetEmployerJobProposalsPayload = {
    jobId: string;
};

type GetEmployerProposalsResponse = GetEmployerJobProposalType[];

const getEmployerJobProposals = async (payload: GetEmployerJobProposalsPayload) => {
    const response = await getRequest(`proposals?job_id=${payload.jobId}`);
    const data = await response.data as GetEmployerProposalsResponse;
    return data;
};

export default getEmployerJobProposals;