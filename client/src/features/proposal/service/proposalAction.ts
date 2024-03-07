import { patchRequest } from "../../../services/api";

type ProposalActionPayload = {
    proposalId: string;
    status: "approved" | "rejected" | "interviewing";
};

type ProposalActionResponse = {
    msg: string;
    status: "rejected" | "interviewing";
    priceType: "hourly" | "fixed";
};

type ApprovedHourlyPriceResponse = {
    msg: string;
    status: "approved";
    priceType: "hourly";
}

type ApprovedFixedPriceResponse = {
    status: "approved";
    priceType: "fixed";
    url: string;
};

const proposalAction = async (payload: ProposalActionPayload) => {
    const response = await patchRequest(`proposals/${payload.proposalId}`, {
        status: payload.status
    });

    const data = await response.data as ProposalActionResponse | (ApprovedHourlyPriceResponse | ApprovedFixedPriceResponse);

    return data
};

export default proposalAction;