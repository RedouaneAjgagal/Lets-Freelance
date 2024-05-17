import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type ProposalsAnalyticsPayload = {
    created_proposal_duration?: "day" | "week" | "month" | "year";
};

export type ProposalsAnalyticsPostedAtType = {
    _id: string;
    count: number;
};

export type ProposalsAnalyticsProposalTypes = {
    _id: "fixed" | "hourly";
    count: number;
    percentage: number;
};

export type ProposalsAnalyticsStatusType = {
    _id: "approved" | "rejected" | "pending" | "interviewing";
    count: number;
    percentage: number;
};

export type ProposalsAnalyticsBoosters = {
    _id: boolean;
    count: number;
    percentage: number;
};

export type ProposalsAnalyticsBoostersTypes = {
    _id: "fixed" | "hourly";
    count: number;
    percentage: number;
};

export type ProposalsAnalyticsTopThreeBoostersType = {
    _id: string;
    connects: number;
};

export type ProposalsAnalyticsResponse = {
    totalProposals: number;
    totalDurationProposals: number;
    totalDurationBoostedTypes: number;
    postedAt: ProposalsAnalyticsPostedAtType[];
    proposalTypes: ProposalsAnalyticsProposalTypes[];
    status: ProposalsAnalyticsStatusType[];
    boosters: ProposalsAnalyticsBoosters[];
    boostersTypes: ProposalsAnalyticsBoostersTypes[];
    topThreeBoosters: ProposalsAnalyticsTopThreeBoostersType[];
}

const proposalsAnalytics = async (payload: ProposalsAnalyticsPayload) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<ProposalsAnalyticsResponse>> = await getRequest(`proposals/analysis/proposal${formatQueries}`);

    const data = await response.data;
    return data;
};

export default proposalsAnalytics;