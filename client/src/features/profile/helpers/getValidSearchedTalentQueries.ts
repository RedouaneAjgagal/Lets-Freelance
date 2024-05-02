import { GetFreelancersPayload } from "../services/getFreelancers";
import {
    isValidSearchKeyword,
    isValidCategory,
    isValidEnglishLevel,
    isValidHourlyRate,
    isValidLocation,
    isValidRating,
    isValidRevenue,
    isValidTalentBadge,
    isValidTalentType
} from "../validators/searchTalentsValidators";

type SearchedTalentPayload = {
    search: string | null;
    badge: string | null;
    rating: string | null;
    revenue: string | null;
    hourlyRate: string | null;
    category: string | null;
    englishLevel: string | null;
    country: string | null;
    talentType: string | null;
}

export const SEARCHED_TALENT_RATES = [4.5, 4, 3];

export const SEARCHED_TALENT_HOURLY_RATES = [
    {
        from: 1,
        to: 10
    },
    {
        from: 10,
        to: 30
    },
    {
        from: 30,
        to: 60
    },
    {
        from: 60,
        to: 999
    },
];

const getValidSearchedTalentQueries = (payload: SearchedTalentPayload) => {
    const validQueries: GetFreelancersPayload = {};

    const validSearch = isValidSearchKeyword(payload.search || "");
    if (validSearch) {
        validQueries.search = payload.search!;
    };

    const validBadge = isValidTalentBadge(payload.badge || "");
    if (validBadge) {
        validQueries.badge = payload.badge! as "top-rated-plus" | "top-rated" | "rising-talent";
    };

    const validRating = isValidRating({
        validRates: SEARCHED_TALENT_RATES,
        rating: payload.rating || ""
    });
    if (validRating) {
        validQueries.rating = Number(payload.rating!);
    };

    const validRevenue = isValidRevenue(payload.revenue || "");
    if (validRevenue) {
        validQueries.revenue = payload.revenue!;
    };

    const validHourlyRate = isValidHourlyRate({
        validHourlyRates: SEARCHED_TALENT_HOURLY_RATES,
        hourlyRate: payload.hourlyRate || ""
    });
    if (validHourlyRate) {
        validQueries.hourly_rate = payload.hourlyRate!;
    };

    const validCategory = isValidCategory(payload.category || "");
    if (validCategory) {
        validQueries.category = payload.category! as "digital-marketing" | "design-creative" | "programming-tech" | "writing-translation" | "video-animation" | "finance-accounting" | "music-audio";
    };

    const validEnglishLevel = isValidEnglishLevel(payload.englishLevel || "");
    if (validEnglishLevel) {
        validQueries.english_level = payload.englishLevel! as "professional" | "native" | "fluent" | "conversational" | "basic";
    };

    const validCountry = isValidLocation(payload.country || "");
    if (validCountry) {
        validQueries.country = payload.country!;
    };

    const validTalentType = isValidTalentType(payload.talentType || "");
    if (validTalentType) {
        validQueries.talent_type = payload.talentType! as "single-freelancer" | "independent-freelancers" | "agency-freelancers";
    };

    return validQueries;
};

export default getValidSearchedTalentQueries;