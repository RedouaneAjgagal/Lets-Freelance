import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";

type UserStatus = {
    status: "paid" | "pending" | "refunded";
    at: string;
}

type ProfileStatementsPaymentType = {
    _id: string;
    activityType: "service" | "job";
    projectType: "hourly" | "fixed";
    amount: number;
    employer: UserStatus;
    freelancer: UserStatus;
}

type ProfileStatementsType = {
    _id: string;
    oneMonthPayments: number;
    oneYearPaymets: number;
    total: number;
    pendingPayments: number;
    payments: ProfileStatementsPaymentType[];
}

const getProfileStatements = async () => {
    const response = await getRequest("profiles/statements");
    const profileStatements: AxiosResponse<ProfileStatementsType> = await response.data;
    return profileStatements;
};

export default getProfileStatements;