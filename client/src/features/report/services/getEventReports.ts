import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries"

export type GetEventReportsPayload = {
    event?: "profile" | "service" | "job";
    duration?: "day" | "week" | "month" | "year";
    sort?: "newest" | "oldest";
    page?: number;
};

type GeneralReportType = {
    _id: string;
    subject: string;
    message?: string;
    createdAt: string;
    submittedBy: {
        user: string;
        name: string;
        userAs: string;
        profile: string;
    };
};

type ProfileEventReportType = {
    event: "profile";
    profile: string;
} & GeneralReportType;

type ServiceEventReportType = {
    event: "service";
    service: string;
} & GeneralReportType;

type JobEventReportType = {
    event: "job";
    job: string;
} & GeneralReportType;

export type EventReportsReponse = (
    ProfileEventReportType |
    ServiceEventReportType |
    JobEventReportType
)[];

const getEventReports = async (payload: GetEventReportsPayload) => {
    const formatedSearchQueries = formatSearchQueries(payload);

    const response: AxiosResponse<Promise<EventReportsReponse>> = await getRequest(`reports${formatedSearchQueries}`);

    const data = await response.data;
    return data;
};

export default getEventReports;