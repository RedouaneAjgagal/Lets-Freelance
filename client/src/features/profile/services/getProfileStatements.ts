import { getRequest } from "../../../services/api";

export type UserStatus = {
    status: "paid" | "pending" | "refunded";
    at: string;
}

export type ProfileStatementsPaymentType = {
    _id: string;
    activityType: "service" | "job";
    projectType: "hourly" | "fixed";
    amount: number;
    employer: UserStatus;
    freelancer: UserStatus;
}

export type ProfileStatementsType = {
    _id: string;
    oneMonthPayments: number;
    oneYearPayments: number;
    total: number;
    pendingPayments: number;
    payments: ProfileStatementsPaymentType[];
}

const getProfileStatements = async () => {
    const response = await getRequest("profiles/statements");
    const profileStatements = await response.data as ProfileStatementsType;
    return profileStatements;
};

export default getProfileStatements;