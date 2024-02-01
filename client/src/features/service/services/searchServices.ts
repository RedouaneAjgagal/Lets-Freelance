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

export type SearchServicesType = {
    numOfPages: number;
    services: SearchServiceType[];
};

export type SearchServicesQuery = {
    category?: "digital-marketing" | "design-creative" | "programming-tech" | "writing-translation" | "video-animation" | "finance-accounting" | "music-audio";
    delivery_time?: number;
    english_level?: "basic" | "conversational" | "fluent" | "native" | "professional";
    country?: string;
    price_range?: string;
    search?: string;
    page?: number
    rating?: number;
    badge?: "rising-talent" | "top-rated" | "top-rated-plus";
}

const searchServices = async (query: SearchServicesQuery) => {
    const searchQuery = formatSearchQueries(query);

    const response = await getRequest(`services${searchQuery}`);
    const services = await response.data as SearchServicesType;
    return services;
};

export default searchServices;