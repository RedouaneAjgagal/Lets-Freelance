import { AxiosResponse } from "axios";
import { postRequest } from "../../../services/api"

export type SubmitReportPayload = {
    event: "profile" | "service" | "job";
    target: string;
    subject: string;
    message?: string;
}

type SubmitReportResponse = {
    msg: string;
}

const submitReport = async (payload: SubmitReportPayload) => {
    const response: AxiosResponse<Promise<SubmitReportResponse>> = await postRequest("reports", payload);

    const data = await response.data;
    return data;
}

export default submitReport;