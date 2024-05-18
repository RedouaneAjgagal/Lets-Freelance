import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries"


export type ContractAnalyticsPayload = {
    created_contract_duration?: "day" | "week" | "month" | "year";
};


export type ContractAnalyticsCreatedType = {
    _id: string;
    count: number;
};

export type ContractAnalyticsContractTypes = {
    _id: "service" | "job";
    count: number;
    percentage: number;
};

export type ContractAnalyticsStatusTypes = {
    _id: "inProgress" | "completed" | "canceled";
    count: number;
    percentage: number;
};

export type ContractAnalyticsCancellationsType = {
    _id: "pending" | "approved" | "rejected";
    count: number;
    percentage: number;
};

export type ContractAnalyticsResponse = {
    totalContracts: number;
    totalDurationContracts: number;
    totalCancellations: number;
    createdContractsAt: ContractAnalyticsCreatedType[];
    contractTypes: ContractAnalyticsContractTypes[];
    contractStatus: ContractAnalyticsStatusTypes[];
    cancellations: ContractAnalyticsCancellationsType[];
};

const contractAnalytics = async (payload) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<ContractAnalyticsResponse>> = await getRequest(`contracts/analysis/contract${formatQueries}`);

    const data = await response.data;
    return data;
}

export default contractAnalytics;