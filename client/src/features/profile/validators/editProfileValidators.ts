type EditProfileInputs = {
    avatar: string;
    name: string;
    phoneNumber: number;
    country: string;
    category: "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";
    dateOfBirth: string;
    hourlyRate: number;
    jobTitle: string;
    portfolio: string;
    gander: "male" | "female";
    englishLevel: "basic" | "conversational" | "fluent" | "native" | "professional";
    types: "agency freelancers" | "independent freelancers" | "single freelancer";
    showProfile: boolean;
    description: string;
    employees: string;
    company: string;
    website: string;
    skills: {
        id: string;
        value: string
    }[];
    education: {
        id: string;
        title: string;
        academy: string;
        year: string;
        description: string;
    }[];
    experience: {
        id: string;
        title: string;
        company: string;
        startDate: string;
        endDate: string;
        description: string;
    }[];
}


const isNumericString = (input: string) => {
    const regex = /^\d+$/;
    return regex.test(input);
}

const isDateString = (input: string) => {
    const date = new Date(input);
    return !isNaN(date.getTime());
}

const isURL = (input: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&amp;a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(input);
}



export const avatarValidation = (avatar: EditProfileInputs["avatar"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!avatar || avatar.trim() === "") {
        result.isError = true;
        result.reason = "Please provide an image";
        return result;
    }

    if (!avatar.startsWith("https://res.cloudinary.com/dqfrgtxde/image/upload") && !avatar.startsWith("https://ui-avatars.com/api")) {
        result.isError = true;
        result.reason = "Invalid image URL";
        return result;
    }

    return result;
}

export const nameValidation = (name: EditProfileInputs["name"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!name || name.trim() === "") {
        result.isError = true;
        result.reason = "Please provide a name";
        return result;
    }

    if (name.trim().length < 3) {
        result.isError = true;
        result.reason = "Must be more than 3 characters";
        return result;
    }

    if (name.trim().length > 20) {
        result.isError = true;
        result.reason = "Must be less than 20 characters";
        return result;
    }

    return result;
}

export const phoneNumberValidation = (phoneNumber: EditProfileInputs["phoneNumber"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    const isValidInputNumber = isNumericString(phoneNumber.toString());

    if (!isValidInputNumber) {
        result.isError = true;
        result.reason = "Invalid number";
        return result
    }

    return result;
}

export const countryValidation = (country: EditProfileInputs["country"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!country || country.trim() === "") {
        return result
    }

    if (isNumericString(country)) {
        result.isError = true;
        result.reason = "Invalid country";
        return result;
    }

    return result;
}

export const categoryValidation = (category: EditProfileInputs["category"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    const categories = ["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"];

    if (!categories.includes(category)) {
        result.isError = true;
        result.reason = "Invalid category";
        return result;
    }

    return result;
}

export const dateOfBirthValidation = (dateOfBirth: EditProfileInputs["dateOfBirth"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!dateOfBirth || dateOfBirth.trim() === "") {
        return result;
    }

    const isValidDate = isDateString(dateOfBirth);
    if (!isValidDate) {
        result.isError = true;
        result.reason = "Invalid date";
        return result;
    }

    const currentDate = new Date(Date.now()).getFullYear();
    const birth = new Date(dateOfBirth).getFullYear();
    const isValidBirthDate = currentDate - birth > 0;
    if (!isValidBirthDate) {
        result.isError = true;
        result.reason = "Invalid date of birth";
        return result;
    }

    return result
}

export const hourlyRateValidation = (hourlyRate: EditProfileInputs["hourlyRate"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!hourlyRate || hourlyRate.toString().trim() === "") {
        result.isError = true;
        result.reason = "Please provide an hourly rate";
        return result;
    }

    const isValidInputNumber = isNumericString(hourlyRate.toString());
    if (!isValidInputNumber) {
        result.isError = true;
        result.reason = "Invalid hourly rate number";
        return result;
    }

    if (hourlyRate < 1) {
        result.isError = true;
        result.reason = "Hourly rate cannot be less than $1";
        return result;
    }

    return result;
}

export const jobTitleValidation = (jobTitle: EditProfileInputs["jobTitle"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!jobTitle || jobTitle.trim() === "") {
        return result;
    }

    if (isNumericString(jobTitle)) {
        result.isError = true;
        result.reason = "Invalid job title";
        return result;
    }

    return result;
}

export const portfolioValidation = (portfolio: EditProfileInputs["portfolio"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!portfolio || portfolio.trim() === "") {
        return result;
    }

    if (!isURL(portfolio)) {
        result.isError = true;
        result.reason = "Invalid URL";
        return result;
    }

    return result;
}

export const genderValidation = (gender: EditProfileInputs["gander"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!gender || gender.trim() === "") {
        result.isError = true;
        result.reason = "Please provide a gender";
        return result;
    }

    const genders = ["male", "female"];
    if (!genders.includes(gender)) {
        result.isError = true;
        result.reason = "Invalid gender";
        return result;
    }

    return result;
}

export const englishLevelValidation = (englishLevel: EditProfileInputs["englishLevel"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!englishLevel || englishLevel.trim() === "") {
        result.isError = true;
        result.reason = "Please provide an english level";
        return result;
    }

    const englishLevels = ["basic", "conversational", "fluent", "native", "professional"];
    if (!englishLevels.includes(englishLevel)) {
        result.isError = true;
        result.reason = "Invalid english level";
        return result;
    }

    return result;
}

export const typesValidation = (type: EditProfileInputs["types"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!type || type.trim() === "") {
        result.isError = true;
        result.reason = "Please provide a type";
        return result;
    }

    const types = ["agency freelancers", "independent freelancers", "single freelancer"];
    if (!types.includes(type)) {
        result.isError = true;
        result.reason = "Invalid type";
        return result;
    }

    return result;
}

export const showProfileValidation = (profileStatus: EditProfileInputs["showProfile"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (typeof profileStatus !== "boolean") {
        result.isError = true;
        result.reason = "Invalid profile status";
        return result;
    }

    return result;
}

export const descriptionValidation = (description: EditProfileInputs["description"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (description.trim().length > 1000) {
        result.isError = true;
        result.reason = "Description cannot be more than 1000 characters";
        return result;
    }

    return result;
}

export const employeesValidation = (employees: EditProfileInputs["employees"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!employees || employees.trim() === "") {
        result.isError = true;
        result.reason = "Please provide how many employees";
        return result;
    }

    const isValidInputNumber = isNumericString(employees);
    if (!isValidInputNumber) {
        result.isError = true;
        result.reason = "Invalid employees number";
        return result;
    }

    if (Number(employees) < 0) {
        result.isError = true;
        result.reason = "Cannot be less than 0";
        return result;
    }

    return result;
}


export const companyNameValidation = (companyName: EditProfileInputs["company"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!companyName || companyName.trim() === "") {
        return result;
    }

    if (isNumericString(companyName)) {
        result.isError = true;
        result.reason = "Invalid company name";
        return result;
    }

    return result;
}

export const websiteValidation = (website: EditProfileInputs["website"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (!website || website.trim() === "") {
        return result;
    }

    if (!isURL(website)) {
        result.isError = true;
        result.reason = "Invalid URL";
        return result;
    }

    return result;
}

export const skillsValidation = (skills: EditProfileInputs["skills"]) => {
    const result = {
        isError: false,
        reason: ""
    }

    if (skills.length > 10) {
        console.log("more than 10");

        result.isError = true;
        result.reason = "Skills cannot be more than 10";
        return result;
    }

    return result;
}

export type EducationError = {
    id: string;
    title: string;
    academy: string;
    year: string;
    description: string;
}

export const educationValidation = (educations: EditProfileInputs["education"]): EducationError[] => {
    const educationKeys: ["title", "academy", "year", "description"] = ["title", "academy", "year", "description"];


    const educationErrorList = educations.map(education => {
        const isEducationError: EducationError = { id: education.id, title: "", academy: "", year: "", description: "" }

        if (educations.length === 1 && educationKeys.every(key => education[key] === "")) {
            return isEducationError;
        }

        educationKeys.forEach((key) => {
            if (!education[key] || education[key].trim() === "") {
                isEducationError[key] = `Must provide ${key} value`;
            }

            if (typeof education[key] !== "string") {
                isEducationError[key] = `Invalid type`;
            }

            const maxCharacters = 300;
            if (key === "description" && education[key].trim().length > maxCharacters) {
                isEducationError[key] = `${key} must be less than ${maxCharacters} characters`;
            }
        });

        return isEducationError;
    });

    return educationErrorList;
}

export type ExperienceError = {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
}

export const experienceValidation = (experiences: EditProfileInputs["experience"]): ExperienceError[] => {
    const experienceKeys: ["title", "company", "startDate", "endDate", "description"] = ["title", "company", "startDate", "endDate", "description"];


    const experienceErrorList = experiences.map(experience => {
        const isExperienceError: ExperienceError = { id: experience.id, title: "", company: "", endDate: "", startDate: "", description: "" }

        if (experiences.length === 1 && experienceKeys.every(key => experience[key] === "")) {
            return isExperienceError;
        }

        experienceKeys.forEach((key) => {
            if (!experience[key] || experience[key].trim() === "") {
                isExperienceError[key] = `Must provide ${key} value`;
            }

            if (typeof experience[key] !== "string") {
                isExperienceError[key] = `Invalid type`;
            }

            const maxCharacters = 300;
            if (key === "description" && experience[key].trim().length > maxCharacters) {
                isExperienceError[key] = `${key} must be less than ${maxCharacters} characters`;
            }
        });

        return isExperienceError;
    });

    return experienceErrorList;
}