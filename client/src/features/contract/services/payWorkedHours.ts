import { patchRequest } from "../../../services/api";

type PayWorkedHoursPayload = {
    contractId: string;
    paymentId: string;
}

type PayWorkedHoursResponse = {
    url: string;
}

const payWorkedHours = async (payload: PayWorkedHoursPayload) => {
    const response = await patchRequest(`contracts/${payload.contractId}/worked-hours`, {
        paymentId: payload.paymentId
    });

    const data = await response.data as PayWorkedHoursResponse;
    return data;
}

export default payWorkedHours;