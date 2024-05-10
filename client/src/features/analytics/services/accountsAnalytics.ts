import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";
import { AnalyticsType } from "../utils/validAccessAnalytics";

type Duration = "day" | "week" | "month" | "year";

export type AccountsAnalyticsPayload = {
    created_accounts_duration?: Duration;
    verified_accounts_duration?: Duration;
}

export type AccountsAnalyticsResponse = {
    totalAccounts: number;
    createdAccounts: AnalyticsType[];
    verifiedAccounts: AnalyticsType[];
}

const accountsAnalytics = async (payload: AccountsAnalyticsPayload) => {
    const searchQueries = formatSearchQueries(payload);
    
    const response: AxiosResponse<Promise<AccountsAnalyticsResponse>> = await getRequest(`auth/users${searchQueries}`);

    const data = await response.data;
    return data;
}

export default accountsAnalytics;