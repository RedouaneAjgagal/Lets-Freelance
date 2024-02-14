import { postRequest } from "../../../services/api"

type IncludedIn = {
    description: string;
    result: string | number | boolean;
}

export type TierType = {
    deliveryTime: number;
    price: number;
    includedIn: IncludedIn[];
}

type CreateServiceType = {
    title: string;
    description: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    featuredImage: string;
    gallery: string[];
    keywords: string[];
    tier: {
        starter: TierType;
        standard: TierType;
        advanced: TierType;
    }
}

type CreateServiceResponseType = {
    msg: string;
}

const createService = async (payload: CreateServiceType) => {
    const response = await postRequest("services", payload);
    const data = await response.data as CreateServiceResponseType;
    return data;
}

export default createService;