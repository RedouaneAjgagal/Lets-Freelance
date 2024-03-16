import { getRequest } from "../../../services/api"

type UserContractType = {
    user: string;
    profile: string;
    status: "inProgress" | "completed" | "canceled";
};

export type JobContractType = {
    activityType: "job";
    job: {
        jobInfo: string;
        estimatedTime: {
            timeType: "hours" | "days" | "months";
            timeValue: number;
        };
        title: string;
        description: string;
        coverLetter: string;
        priceType: "hourly" | "fixed";
        price: number;
        proposal: string;
    };
};

export type ServiceContractType = {
    activityType: "service";
    service: {
        serviceInfo: string;
        title: string;
        description: string;
        tierName: "starter" | "standard" | "advanced";
        tier: {
            deliveryTime: number;
            price: number;
            includedIn: {
                _id: string;
                description: string;
                result: number | boolean;
            }[];
        };
    }
}

type ContractCancelRequest = {
    isCancelRequest: true;
    subject: string;
    reason: string;
}

type ContractUserPayment = {
    status: "pending" | "paid" | "refunded";
    net?: number;
    at: string;
};

export type ContractEmployerRefundRequest = {
    status: "pending" | "rejected" | "approved";
    subject: string;
    reason: string;
    requestedAt: string;
};

export type ContractPayment = {
    _id: string;
    freelancer: ContractUserPayment;
    employer: ContractUserPayment & { refundRequest?: ContractEmployerRefundRequest };
    amount: number;
    workedHours?: number;
    sessionId?: string;
    chargeId?: string;
};

type ServiceReview = {
    activityType: "service";
    service: string;
}

type JobReview = {
    activityType: "job";
    job: string;
}

export type ContractReviewType = {
    _id: string;
    contract: string;
    freelancer: string;
    employer: string;
    activityTitle: string;
    description: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    submittedBy: "freelancer" | "employer";
} & (ServiceReview | JobReview);

export type GetUserContractsReponse = {
    _id: string;
    freelancer: UserContractType;
    employer: UserContractType;
    cancelRequest: {
        freelancer?: ({ isCancelRequest: false } | ContractCancelRequest);
        employer?: ({ isCancelRequest: false } | ContractCancelRequest);
        status?: "pending" | "rejected" | "approved";
    };
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    payments: ContractPayment[];
    review?: ContractReviewType
} & (JobContractType | ServiceContractType);

const getUserSingleContract = async (contractId: string) => {
    const response = await getRequest(`contracts/${contractId}`);

    const data = await response.data as GetUserContractsReponse;
    return data;
}

export default getUserSingleContract;