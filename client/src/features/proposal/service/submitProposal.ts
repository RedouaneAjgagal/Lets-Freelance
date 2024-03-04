import { postRequest } from "../../../services/api";

export type SubmitProposalPayload = {
    jobId: string;
    coverLetter: string;
    estimatedTime: {
        timeType: "hours" | "days" | "months";
        timeValue: number;
    };
    price: number;
    spentConnects: number;
};

type SubmitProposalResponse = {
    msg: string;
};

const submitProposal = async (payload: SubmitProposalPayload) => {
    const response = await postRequest("proposals", payload);
    const data = await response.data as SubmitProposalResponse;
    return data;
}

export default submitProposal;