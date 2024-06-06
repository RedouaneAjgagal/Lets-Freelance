import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api"

type ContractUserType = {
    user: string;
    profile: string;
    status: "inProgress" | "completed" | "canceled";
};

type ContractIncludedInService = {
    description: string;
    result: string | number | boolean;
}

type ContractServiceType = {
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

type ContractJobType = {
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

type ContractRequestType = {
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

type ContractPaymentType = {
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
    freelancer: ContractUserType;
    employer: ContractUserType;
    cancelRequest: {
        freelancer: {
            isCancelRequest: false;
        } | ContractRequestType;
        employer: {
            isCancelRequest: false;
        } | ContractRequestType;
        status: "pending" | "rejected" | "approved";
    };
    payments: ContractPaymentType[];
    createdAt: string;
    updatedAt: string;
};

type ServiceContractType = {
    activityType: "service";
    service: ContractServiceType;
} & ContractType;

type JobContractType = {
    activityType: "job";
    job: ContractJobType;
} & ContractType;

type GetContractType = (ServiceContractType | JobContractType);

type GetContractsResponse = GetContractType[];

const getRefundRequests = async () => {
    const response: AxiosResponse<Promise<GetContractsResponse>> = await getRequest(`contracts/refund`);

    const data = await response.data;
    return data;
};

export default getRefundRequests;