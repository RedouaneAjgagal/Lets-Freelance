import { getRequest } from "../../../services/api";

export type SetAsPaidHoursPayload = {
    contractId: string;
    session_id: string;
}

type SetAsPaidHoursResponse = {
    msg: string;
    contractId: string;
}

const setAsPaidHours = async (payload: SetAsPaidHoursPayload) => {
    const response = await getRequest(`contracts/${payload.contractId}/worked-hours?session_id=${payload.session_id}`);

    const data = await response.data as SetAsPaidHoursResponse;
    return data;
}

export default setAsPaidHours;