import { getRequest } from "../../../services/api";

export type MarkAsPaidFixedPriceProposalPayload = {
    session_id: string;
    proposalId: string;
};

type MarkAsPaidFixedPriceProposalResponse = {
    msg: string;
};

const markAsPaidFixedPriceProposal = async (payload: MarkAsPaidFixedPriceProposalPayload) => {
    const response = await getRequest(`proposals/${payload.proposalId}/fixed-job?session_id=${payload.session_id}`);

    const data = await response.data as MarkAsPaidFixedPriceProposalResponse;
    return data;
};

export default markAsPaidFixedPriceProposal;