import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api"

type EmployersAnalyticsResponse = {
    totalEmployers: number;
    spendOnServices: {
        count: number;
        percentage: number;
    };
};

const employersAnalytics = async () => {
    const response: AxiosResponse<Promise<EmployersAnalyticsResponse>> = await getRequest(`profiles/analysis/employers`);

    const data = await response.data;
    return data;
}

export default employersAnalytics;