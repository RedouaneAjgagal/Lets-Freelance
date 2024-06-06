import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api"

type ContractIncludedInService = {
    _id: string;
    description: string;
    result: string | number | boolean;
}

export type ContractServiceType = {
    serviceInfo: string;
    title: string;
    description: string;
    tierName: "starter" | "standard" | "advanced";
    tier: {
        deliveryTime: number;
        price: number;
        includedIn: ContractIncludedInService[];
    };
};

export type ContractJobType = {
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

export type ContractPaymentType = {
    _id: string;
    amount: number;
    employer: UserPaymentType & { refundRequest?: RefundRequestType };
    freelancer: UserPaymentType;
    workedHours?: number;
    sessionId?: string;
    chargeId?: string;
};

type ContractType = {
    _id: string;
    payments: ContractPaymentType[];
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
};

type ServiceContractType = {
    activityType: "service";
    service: ContractServiceType;
} & ContractType;

type JobContractType = {
    activityType: "job";
    job: ContractJobType;
} & ContractType;

export type GetRefundRequestContractType = (ServiceContractType | JobContractType);

export type GetRefundRequestContractsResponse = GetRefundRequestContractType[];

const getRefundRequests = async () => {
    const response: AxiosResponse<Promise<GetRefundRequestContractsResponse>> = await getRequest(`contracts/refund`);

    const data = await response.data;
    return data;
};

export default getRefundRequests;