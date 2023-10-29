

const isValidBadge = (badge: any) => {
    const badges = {
        "rising-talent": "rising talent",
        "top-rated": "top rated",
        "top-rated-plus": "top rated plus",
    } as const;

    const isValid = badge && Object.keys(badges).includes(badge.toString());
    if (!isValid) return undefined;

    return badges[badge as keyof typeof badges];
}

const isValidRating = (rating: any): string | undefined => {
    const isValid = rating && /^(?:[1-4](?:\.[0-9])?|5(?:\.0)?)$/.test(rating.toString());
    if (!isValid) return undefined;

    return rating.toString();
}

const isValidHourlyRate = (hourlyRate: any): string | undefined => {
    const isValid = hourlyRate && /^\d+,\d+$/.test(hourlyRate.toString());
    if (!isValid) return undefined;

    return hourlyRate.toString();
}

const isValidRevenue = (revenue: any): string | undefined => {
    const isValid = revenue && (/^\d+,\d+$/.test(revenue?.toString()) || /^\d+,infinity$/.test(revenue?.toString()));
    if (!isValid) return undefined;
    return revenue.toString();
}

const isValidCategory = (category: any) => {
    const categories = {
        "digital-marketing": "digital marketing",
        "design-creative": "design & creative",
        "programming-tech": "programming & tech",
        "writing-translation": "writing & translation",
        "video-animation": "video & animation",
        "finance-accounting": "finance & accounting",
        "music-audio": "music & audio"
    } as const;

    const isValid = category && Object.keys(categories).includes(category.toString());
    if (!isValid) return undefined;

    return categories[category as keyof typeof categories]
}

const isValidEnglishLevel = (englishLevel: any) => {
    const englishLevels = ["basic", "conversational", "fluent", "native", "professional"] as const;
    const isValid = englishLevel && englishLevels.includes(englishLevel.toString());
    if (!isValid) return undefined;

    return englishLevel.toString() as typeof englishLevels[number];
}

const isValidTalentType = (talentType: any) => {
    const talentTypes = {
        "agency": "agency freelancers",
        "independent-freelancers": "independent freelancers",
        "single-freelancer": "single freelancer"
    } as const;

    const isValid = talentType && Object.keys(talentTypes).includes(talentType.toString());
    if (!isValid) return undefined;
    return talentTypes[talentType.toString() as keyof typeof talentTypes];
}

const isValidSearch = (search: any): string | undefined => {
    if (!search || search.toString().trim() === "") return undefined;
    return search.toString();
}

const isValidCountry = (country: any): string | undefined => {
    if (!country || country.toString().trim() === "") return undefined;
    return country.toString();
}

const searchFreelancersQueryValidator = {
    isValidBadge,
    isValidCategory,
    isValidCountry,
    isValidEnglishLevel,
    isValidHourlyRate,
    isValidRating,
    isValidRevenue,
    isValidSearch,
    isValidTalentType
}

export default searchFreelancersQueryValidator;