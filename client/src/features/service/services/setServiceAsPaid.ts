import { getRequest } from "../../../services/api";

export type SetServiceAsPaidPayload = {
    serviceId: string;
    session_id: string;
}

type SetServiceAsPaidType = {
    msg: string;
}

const setServiceAsPaid = async ({ serviceId, session_id }: SetServiceAsPaidPayload) => {
    const response = await getRequest(`services/${serviceId}/order?session_id=${session_id}`);
    const data = await response.data as SetServiceAsPaidType;
    return data;
};

export default setServiceAsPaid;