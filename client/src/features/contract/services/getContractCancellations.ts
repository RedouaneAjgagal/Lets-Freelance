import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api"

type ContractCancellationUserType = {
    user: string;
    profile: string;
    status: "inProgress" | "completed" | "canceled";
};

type ContractCancellationsIncludedInService = {
    description: string;
    result: string | number | boolean;
}

export type ContractCancellationServiceType = {
    serviceInfo: string;
    title: string;
    description: string;
    tierName: "starter" | "standard" | "advanced";
    tier: {
        deliveryTime: number;
        price: number;
        includedIn: ContractCancellationsIncludedInService[];
    };
};

export type ContractCancellationJobType = {
    jobInfo: string;
    title: string;
    description: string;
    coverLetter: string;
    priceType: "fixed" | "hourly";
    price: number;
    estimatedTime: {
        timeType: "hours" | "days" | "months";
        timeValue: number;
    };
    proposal: string;
};

export type ContractCancellationRequestType = {
    isCancelRequest: true;
    subject: string;
    reason: string;
};

type RefundRequestType = {
    status: "pending" | "rejected" | "approved";
    subject: string;
    reason: string;
    requestedAt: string;
};

type UserPaymentType = {
    status: "pending" | "paid" | "refunded";
    at: string;
    net: number;
};

type ContractCancellationPaymentType = {
    _id: string;
    amount: number;
    employer: UserPaymentType & { refundRequest?: RefundRequestType };
    freelancer: UserPaymentType;
    workedHours?: number;
    sessionId?: string;
    chargeId?: string;
};

type ContractCancellationType = {
    _id: string;
    freelancer: ContractCancellationUserType;
    employer: ContractCancellationUserType;
    cancelRequest: {
        freelancer: {
            isCancelRequest: false;
        } | ContractCancellationRequestType;
        employer: {
            isCancelRequest: false;
        } | ContractCancellationRequestType;
        status: "pending" | "rejected" | "approved";
    };
    payments: ContractCancellationPaymentType[];
    createdAt: string;
    updatedAt: string;
};

type ServiceContractCancellationType = {
    activityType: "service";
    service: ContractCancellationServiceType;
} & ContractCancellationType;

type JobContractCancellationType = {
    activityType: "job";
    job: ContractCancellationJobType;
} & ContractCancellationType;

export type GetContractCancellationType = (ServiceContractCancellationType | JobContractCancellationType);

export type GetContractCancellationsResponse = GetContractCancellationType[];

const getContractCancellations = async () => {
    const response: AxiosResponse<Promise<GetContractCancellationsResponse>> = await getRequest(`contracts/cancel-requests`);

    const data = await response.data;
    return data;
};

export default getContractCancellations;