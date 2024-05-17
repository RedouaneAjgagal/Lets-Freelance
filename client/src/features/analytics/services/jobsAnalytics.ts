import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type JobsAnalyticsPayload = {
    created_job_duration?: "day" | "week" | "month" | "year";
};

export type JobsAnalyticsPostedAtType = {
    _id: string;
    count: number;
};

export type JobsAnalyticsJobTypes = {
    _id: "hourly" | "fixed";
    count: number;
    percentage: number;
};

export type JobAnalyticsHourlyPriceJobType = {
    _id: "low" | "mid" | "high",
    count: number;
    percentage: number;
};

export type JobAnalyticsFixedPriceJobType = {
    _id: "low" | "mid" | "high" | "superHigh",
    count: number;
    percentage: number;
}

export type JobsAnalyticsResponse = {
    totalJobs: number;
    totalDurationJobs: number;
    totalHourlyJobs: number;
    totalFixedJobs: number;
    postedAt: JobsAnalyticsPostedAtType[];
    jobTypes: JobsAnalyticsJobTypes[];
    hourlyJobs: JobAnalyticsHourlyPriceJobType[];
    fixedJobs: JobAnalyticsFixedPriceJobType[];
};

const jobsAnalytics = async (payload: JobsAnalyticsPayload) => {
    const formatQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<JobsAnalyticsResponse>> = await getRequest(`jobs/analysis/job${formatQueries}`);

    const data = await response.data;
    return data;
};

export default jobsAnalytics;