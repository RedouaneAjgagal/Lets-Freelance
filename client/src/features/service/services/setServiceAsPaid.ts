import { getRequest } from "../../../services/api";
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type SetServiceAsPaidPayload = {
    serviceId: string;
    session_id: string;
    track_id?: string;
}

type SetServiceAsPaidType = {
    msg: string;
    ad?: {
        track: string;
        order: string
    }
}

const setServiceAsPaid = async ({ serviceId, session_id, track_id }: SetServiceAsPaidPayload) => {
    const searchQueries = formatSearchQueries({
        session_id,
        track_id: track_id
    });

    const response = await getRequest(`services/${serviceId}/order${searchQueries}`);
    const data = await response.data as SetServiceAsPaidType;
    return data;
};

export default setServiceAsPaid;