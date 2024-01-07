import { getRequest } from "../../../services/api"
import { Category } from "../../profile/helpers/getFormatedCategory";

type Rating = {
    avgRate: number | undefined;
    numOfReviews: number;
};

export type FavoriteService = {
    _id: string;
    event: "service";
    service: {
        _id: string;
        title: string;
        category: Category;
        featuredImage: string;
        tier: {
            starter: {
                price: number;
            };
        };
        rating: Rating;
    };
    serviceBy: {
        _id: string;
        name: string;
        avatar: string;
        userAs: "freelancer",
        roles: {
            freelancer: {
                badge: "none" | "rising talent" | "top rated" | "top rated plus";
                englishLevel: "basic" | "conversational" | "fluent" | "native" | "professional";
            };
        };
        rating: Rating;
        country: string | undefined;
    };
};

export type FavoriteJob = {
    _id: string;
    event: "job";
    job: {
        _id: string;
        title: string;
        description: string;
        priceType: "hourly" | "fixed";
        price: {
            min: number;
            max: number;
        };
        duration: {
            dateType: "hours" | "days" | "months";
            dateValue: number;
        };
        experienceLevel: "expert" | "intermediate" | "entryLevel";
        tags: string[];
        createdAt: string;
    };
};

export type FavoriteFreelancer = {
    _id: string;
    event: "profile";
    profile: {
        _id: string;
        avatar: string;
        userAs: "freelancer";
        roles: {
            freelancer: {
                badge: "none" | "rising talent" | "top rated" | "top rated plus";
                jobTitle: string | undefined;
                hourlyRate: number;
                skills: string[];
            }
        };
        category: Category;
        country: string | undefined;
        rating: Rating;
    }
}

export type FavoriteEmployer = {
    _id: string;
    event: "profile";
    profile: {
        _id: string;
        name: string;
        avatar: string;
        userAs: "employer";
        category: Category;
        roles: {
            employer: {
                employees: number;
                totalJobPosted: number;
            }
        };
        rating: Rating;
        country: string | undefined;
    }
}

export type FavoritesType = {
    services: FavoriteService[];
    jobs: FavoriteJob[];
    freelancers: FavoriteFreelancer[];
    employers: FavoriteEmployer[];
}

const getFavorites = async () => {
    const response = await getRequest("favourites");
    const favorites = await response.data as FavoritesType;
    return favorites;
}

export default getFavorites;