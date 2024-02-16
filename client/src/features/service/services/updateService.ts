import { patchRequest } from "../../../services/api"

type IncludedIn = {
    description: string;
    result: string | number | boolean;
}

export type TierType = {
    deliveryTime: number;
    price: number;
    includedIn: IncludedIn[];
}

type UpdateServiceType = {
    title: string;
    description: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    featuredImage: string;
    gallery: string[];
    tier: {
        starter: TierType;
        standard: TierType;
        advanced: TierType;
    }
}

type UpdateServiceResponseType = {
    msg: string;
}

const updateService = async ({ serviceId, service }: { serviceId: string; service: UpdateServiceType }) => {
    const response = await patchRequest(`services/${serviceId}`, service);
    const data = await response.data as UpdateServiceResponseType;
    return data;
}

export default updateService;