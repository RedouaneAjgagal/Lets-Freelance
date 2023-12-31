import { IFreelancerRole } from "../profile.model"

const isValidDateOfBirthInput = (dateOfBirth: IFreelancerRole["dateOfBirth"] | undefined) => {
    const isValidDateOfBirth = dateOfBirth && typeof dateOfBirth === "string";
    return isValidDateOfBirth;
}

const isValidHourlyRateInput = (hourlyRate: IFreelancerRole["hourlyRate"] | undefined) => {
    const isValidHourlyRate = hourlyRate && typeof hourlyRate === "number" && hourlyRate > 0;
    return isValidHourlyRate;
}

const isValidJobTitleInput = (jobTitle: IFreelancerRole["jobTitle"] | undefined) => {
    const isValidJobTitle = jobTitle || jobTitle?.trim() === "";
    return isValidJobTitle;
}

const isValidPortfolioInput = (portfolio: IFreelancerRole["portfolio"] | undefined) => {
    const isValidPortfolio = portfolio || portfolio?.trim() === "";
    return isValidPortfolio;
}

const isValidGenderInput = (gender: IFreelancerRole["gender"] | undefined) => {
    const isValidGender = gender === "male" || gender === "female";
    return isValidGender;
}

const isValidEnglishLevelInput = (englishLevel: IFreelancerRole["englishLevel"] | undefined) => {
    const englishLevels = ["basic", "conversational", "fluent", "native", "professional"];
    const isValidEnglishLevel = englishLevel && englishLevels?.includes(englishLevel);
    return isValidEnglishLevel;
}

const isValidTypesInput = (type: IFreelancerRole["types"] | undefined) => {
    const types = ["agency freelancers", "independent freelancers", "single freelancer"];
    const isValidType = type && types.includes(type);
    return isValidType;
}

const isValidSkillsInput = (skills: IFreelancerRole["skills"] | undefined) => {
    const isValidSkills = skills && skills.length <= 10;
    if (isValidSkills) {
        const getSkills = skills!.filter(skill => typeof skill === "string" && skill.trim() !== "");
        return getSkills;
    }
    return isValidSkills;
}

const isValidEducationInput = (educations: IFreelancerRole["education"]) => {
    if (!educations || educations.length > 10) {
        return false;
    }

    const educationKeys = ["title", "academy", "year", "description"];

    const isValidEducations = educations.every(education => {
        const isValidPropertiesValue = Object.entries(education).every(([key, value]) => {
            if (!educationKeys.includes(key)) {
                return false;
            }
            const validation = value && typeof value === "string" && value.trim() !== "";

            if (key === "description" && value.trim().length > 300) {
                return false;
            }

            return validation;
        });

        return isValidPropertiesValue;
    });

    return isValidEducations;
}

const isValidExperienceInput = (experience: IFreelancerRole["experience"]) => {
    if (!experience || experience.length > 10) {
        return false;
    }

    const educationKeys = ["title", "company", "startDate", "endDate", "description"];

    const isValidExperiences = experience.every(experience => {
        const isValidPropertiesValue = Object.entries(experience).every(([key, value]) => {
            if (!educationKeys.includes(key)) {
                return false
            }

            const validation = value && typeof value === "string" && value.trim() !== "";

            if (key === "description" && value.trim().length > 300) {
                return false;
            }

            return validation;
        })

        return isValidPropertiesValue;
    });

    return isValidExperiences;
}

export {
    isValidDateOfBirthInput,
    isValidEnglishLevelInput,
    isValidGenderInput,
    isValidHourlyRateInput,
    isValidJobTitleInput,
    isValidPortfolioInput,
    isValidTypesInput,
    isValidSkillsInput,
    isValidEducationInput,
    isValidExperienceInput
}
