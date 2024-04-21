import { postRequest } from "../../../services/api";

export type OrderServicePayload = {
    serviceId: string;
    tier: "starter" | "standard" | "advanced";
    track?: string;
};

type OrderServiceType = {
    url: string;
};

const orderService = async ({ serviceId, tier, track }: OrderServicePayload) => {
    const orderPayload: {
        tier: OrderServicePayload["tier"];
        track?: OrderServicePayload["track"]
    } = {
        tier
    };

    if (track) {
        orderPayload.track = track;
    }

    const response = await postRequest(`services/${serviceId}/order`, orderPayload);
    const data = await response.data as OrderServiceType;
    return data;
};

export default orderService;