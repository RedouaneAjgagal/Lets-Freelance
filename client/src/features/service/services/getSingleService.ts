import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api"
import { Category } from "../../profile/helpers/getFormatedCategory";

type Rating = {
    avgRate?: number;
    numOfReviews: number;
}

export type ServiceIncludedInTier = {
    _id: string;
    description: string;
    result: string | number | boolean;
}

export type ServiceTier = {
    deliveryTime: number;
    price: number;
    includedIn: ServiceIncludedInTier[];
}

export type ServiceTiersTypes = {
    starter: ServiceTier;
    standard: ServiceTier;
    advanced: ServiceTier;
}

export type SingleServiceType = {
    _id: string;
    user: string;
    profile: {
        _id: string;
        name: string;
        avatar: string;
        userAs: "freelancer";
        rating: Rating;
        roles: {
            freelancer: {
                badge: "none" | "rising talent" | "top rated" | "top rated plus";
            };
        };
    };
    title: string;
    description: string;
    category: Category;
    featuredImage: string;
    gallery: string[];
    createdAt: string;
    updatedAt: string;
    tier: ServiceTiersTypes;
    rating: Rating;
    isFavorited: boolean;
}

const getSingleService = async (serviceId: string) => {
    const response: AxiosResponse<Promise<SingleServiceType>> = await getRequest(`services/${serviceId}`);
    const serviceInfo = await response.data;
    return serviceInfo;
}

export default getSingleService;