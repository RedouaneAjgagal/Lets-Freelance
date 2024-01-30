import { postRequest } from "../../../services/api";

type OrderServicePayload = {
    serviceId: string;
    tier: "starter" | "standard" | "advanced";
};

type OrderServiceType = {
    url: string;
};

const orderService = async ({ serviceId, tier }: OrderServicePayload) => {
    const response = await postRequest(`services/${serviceId}/order`, {
        tier
    });
    const data = await response.data as OrderServiceType;
    return data;
};

export default orderService;