import { getRequest } from "../../../services/api";

type RatingType = {
    avgRate: number | undefined;
    numOfReviews: number;
}

type TrendingService = {
    _id: string;
    title: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    featuredImage: string;
    tier: {
        starter: {
            price: number;
        };
    };
    rating: RatingType;
    createdAt: string;
};

type TrendingServiceProfileType = {
    _id: string;
    name: string;
    avatar: string;
};

export type TrendingServiceType = {
    service: TrendingService;
    profile: TrendingServiceProfileType;
};

const getTrendingServices = async () => {
    const response = await getRequest("services/trending");
    const trendingServices = await response.data as TrendingServiceType[];
    return trendingServices;
};

export default getTrendingServices;