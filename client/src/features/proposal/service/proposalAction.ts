import { patchRequest } from "../../../services/api";

type ProposalActionPayload = {
    proposalId: string;
    status: "approved" | "rejected" | "interviewing";
}

type ProposalActionResponse = {
    msg: string;
    status: "approved" | "rejected" | "interviewing";
};

const proposalAction = async (payload: ProposalActionPayload) => {
    const response = await patchRequest(`proposals/${payload.proposalId}`, {
        status: payload.status
    });

    const data = await response.data as ProposalActionResponse;
    return data;
};

export default proposalAction;