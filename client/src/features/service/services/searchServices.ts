import { AxiosResponse } from "axios";
import { getRequest } from "../../../services/api"
import formatSearchQueries from "../../../utils/formatSearchQueries";

export type SearchServiceType = {
    _id: string;
    title: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    featuredImage: string;
    tier: {
        starter: {
            price: number;
        };
    };
    rating: {
        avgRate?: number;
        numOfReviews: number;
    };
    profile: {
        _id: string;
        name: string;
        avatar: string;
        userAs: "freelancer";
        roles: {
            freelancer: {
                englishLevel: "basic" | "conversational" | "fluent" | "native" | "professional";
                badge: "none" | "rising talent" | "top rated" | "top rated plus";
            };
        };
        country?: string;
    };
}

type UnsponsoredService = {
    sponsored: false;
} & SearchServiceType;

type SponsoredService = {
    sponsored: true;
    ad: {
        _id: string;
    }
} & SearchServiceType;


export type ServiceType = (UnsponsoredService | SponsoredService);

export type SearchServicesType = {
    numOfPages: number;
    numOfServices: number;
    services: ServiceType[];
};

export type SearchServicesQuery = {
    category?: "all-categories" | "digital-marketing" | "design-creative" | "programming-tech" | "writing-translation" | "video-animation" | "finance-accounting" | "music-audio";
    delivery_time?: number;
    english_level?: "Any level" | "basic" | "conversational" | "fluent" | "native" | "professional";
    country?: string;
    price_range?: string;
    search?: string;
    page?: number;
    rating?: number;
    badge?: "any-talent" | "rising-talent" | "top-rated" | "top-rated-plus";
}

const searchServices = (query: SearchServicesQuery) => async ({ pageParam = 1 }) => {
    const searchQuery = formatSearchQueries({ ...query, page: pageParam });

    const response: AxiosResponse<Promise<SearchServicesType>> = await getRequest(`services${searchQuery}`);
    const services = await response.data;
    return services;
};

export default searchServices;