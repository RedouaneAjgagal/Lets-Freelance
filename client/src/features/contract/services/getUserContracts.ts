import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type UserContractsQuery = {
    status?: "inProgress" | "completed" | "canceled";
    job_id?: string;
    service_id?: string;
};

type ServiceContractType = {
    activityType: "service";
    _id: string;
    title: string;
    tier: {
        price: number;
    };
};

type JobContractType = {
    activityType: "job";
    _id: string;
    priceType: "fixed" | "hourly";
    price: number;
};

export type ContractResponseType = {
    _id: string;
    status: "inProgress" | "completed" | "canceled";
    createdAt: string;
} & (ServiceContractType | JobContractType);

type UserContractsResponse = ContractResponseType[];


const getUserContracts = async (query: UserContractsQuery) => {
    const queries = formatSearchQueries(query);

    const response = await getRequest(`contracts${queries}`);

    const data = await response.data as UserContractsResponse;
    return data;
}

export default getUserContracts;