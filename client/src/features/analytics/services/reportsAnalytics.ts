import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type ReportsAnalyticsPayload = {
    created_report_duration?: "day" | "week" | "month" | "year";
};

export type ReportsAnalyticsReportedAtType = {
    _id: string;
    count: number;
};

export type ReportsAnalyticsReportedEventsType = {
    _id: "profile" | "job" | "service";
    count: number;
    percentage: number;
};

export type ReportsAnalyticsResponse = {
    totalReports: number;
    totalDurationReports: number;
    reportedAt: ReportsAnalyticsReportedAtType[];
    reportedEvents: ReportsAnalyticsReportedEventsType[];
};

const reportsAnalytics = async (payload: ReportsAnalyticsPayload) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<ReportsAnalyticsResponse>> = await getRequest(`reports/analysis/report${formatQueries}`);

    const data = await response.data;
    return data;
};

export default reportsAnalytics;