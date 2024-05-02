const isValidSearchKeyword = (keyword: string) => {
    if (!keyword || keyword.trim() === "") {
        return false;
    };

    return true;
}

const isValidTalentBadge = (badge: string) => {
    if (!badge || badge.trim() === "") {
        return false;
    };

    const validBadges = ["rising-talent", "top-rated", "top-rated-plus"];
    if (!validBadges.includes(badge)) {
        return false;
    };

    return true;
}

const isValidRating = ({ rating, validRates }: { rating: string; validRates: number[] }) => {
    if (!rating || rating.toString() === "") {
        return false;
    };

    const isInValidRatingNumber = Number.isNaN(rating);
    if (isInValidRatingNumber) {
        return false;
    };

    const rate = Number(rating);
    const isValidRates = validRates.includes(rate);
    if (!isValidRates) {
        return false;
    };

    return true;
}

const isValidCategory = (category: string) => {
    if (!category || category.trim() === "") {
        return false;
    };

    const categories = ["digital-marketing", "design-creative", "programming-tech", "writing-translation", "video-animation", "finance-accounting", "music-audio"];

    const isValidCategory = categories.includes(category);
    if (!isValidCategory) {
        return false;
    };

    return true;
}

const isValidRevenue = (revenue: string) => {
    if (!revenue || revenue.trim() === "") {
        return false;
    };

    const isValidRevenueType = /^\d+,\d+$/.test(revenue) || /^\d+,infinity$/.test(revenue);
    if (!isValidRevenueType) {
        return false;
    };

    const [from, to] = revenue.split(",");
    if (!Number.isNaN(to) && (Number(from) > Number(to))) {
        return false;
    };

    return true;
}

const isValidHourlyRate = ({ hourlyRate, validHourlyRates }: { hourlyRate: string; validHourlyRates: { from: number; to: number }[] }) => {
    if (!hourlyRate || hourlyRate.trim() === "") {
        return false;
    };

    const isValidHourlyRateType = /^\d+,\d+$/.test(hourlyRate);
    if (!isValidHourlyRateType) {
        return false;
    };

    const [from, to] = hourlyRate.split(",");
    const fromHourlyRate = Number(from);
    const toHourlyRate = Number(to);

    if (fromHourlyRate > toHourlyRate) {
        return false;
    };

    const isValidHourlyRate = validHourlyRates.some(validHourlyRate => {
        if (validHourlyRate.from === fromHourlyRate && validHourlyRate.to === toHourlyRate) {
            return true
        };

        return false;
    });

    if (!isValidHourlyRate) {
        return false;
    };

    return true;
}

const isValidTalentType = (talentType: string) => {
    if (!talentType || talentType.trim() === "") {
        return false;
    };

    const validTalentTypes = ["single-freelancer", "independent-freelancers", "agency-freelancers"];

    const isValidTalentType = validTalentTypes.includes(talentType);
    if (!isValidTalentType) {
        return false;
    }

    return true;
}

const isValidEnglishLevel = (englishLevel: string) => {
    if (!englishLevel || englishLevel.trim() === "") {
        return false;
    };

    const validEnglishLevels = ["basic", "conversational", "fluent", "native", "professional"];

    const isValidEnglishLevel = validEnglishLevels.includes(englishLevel);
    if (!isValidEnglishLevel) {
        return false;
    };

    return true;
}

const isValidLocation = (location: string) => {
    if (!location || location.trim() === "") {
        return false;
    };

    return true;
}

export {
    isValidSearchKeyword,
    isValidTalentBadge,
    isValidCategory,
    isValidEnglishLevel,
    isValidHourlyRate,
    isValidLocation,
    isValidRating,
    isValidRevenue,
    isValidTalentType
}