import { postRequest } from "../../../services/api";

type SubmitWorkedHoursPayload = {
    contractId: string;
    workedHours: number;
}

type SubmitWorkedHoursResponse = {
    msg: string;
    workedHours: number;
}

const submitWorkedHours = async (payload: SubmitWorkedHoursPayload) => {
    const response = await postRequest(`contracts/${payload.contractId}/worked-hours`, {
        workedHours: payload.workedHours
    });

    const data = await response.data as SubmitWorkedHoursResponse;
    return data;
}

export default submitWorkedHours;