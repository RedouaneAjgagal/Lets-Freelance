import { IProfile, IFreelancerRole, IEmployerRole } from "../profile.model"
import { isValidNameInput, isValidAvatarInput, isValidCategoryInput, isValidCountryInput, isValidDescriptionInput, isValidPhoneNumberInput, isValidShowProfileInput } from "../validators/generalProfileInputValidators";
import { isValidCompanyInput, isValidEmployeesInput, isValidWebsiteInput } from "../validators/employerInputValidator";
import { isValidTypesInput, isValidDateOfBirthInput, isValidEnglishLevelInput, isValidGenderInput, isValidHourlyRateInput, isValidJobTitleInput, isValidPortfolioInput, isValidSkillsInput, isValidEducationInput } from "../validators/freelancerInputValidator";


type UpdateProfileInfo = {
    newProfileInfo: Partial<IProfile>;
    roles: IProfile["roles"];
    userAs: IProfile["userAs"];
}

const getUpdatedProfileInfo = ({ newProfileInfo, roles, userAs }: UpdateProfileInfo) => {
    const updatedProfileInfo: Partial<IProfile> = {
        roles
    }

    const validNameInput = isValidNameInput(newProfileInfo.name);
    if (validNameInput) {
        updatedProfileInfo.name = newProfileInfo.name;
    }

    const validAvatarInput = isValidAvatarInput(newProfileInfo.avatar);
    if (validAvatarInput) {
        updatedProfileInfo.avatar = newProfileInfo.avatar;
    }

    const validShowProfile = isValidShowProfileInput(newProfileInfo.showProfile);
    if (validShowProfile) {
        updatedProfileInfo.showProfile = newProfileInfo.showProfile;
    }

    const validCountryInput = isValidCountryInput(newProfileInfo.country);
    if (validCountryInput) {
        updatedProfileInfo.country = newProfileInfo.country!.trim();
    }

    const validPhoneNumberInput = isValidPhoneNumberInput(newProfileInfo.phoneNumber);
    if (validPhoneNumberInput) {
        updatedProfileInfo.phoneNumber = Number(newProfileInfo.phoneNumber);
    }

    const validCategoryInput = isValidCategoryInput(newProfileInfo.category);
    if (validCategoryInput) {
        updatedProfileInfo.category = newProfileInfo.category;
    }

    const validDescriptionInput = isValidDescriptionInput(newProfileInfo.description);
    if (validDescriptionInput) {
        updatedProfileInfo.description = newProfileInfo.description?.trim();
    }

    if (userAs === "freelancer") {
        const validDateOfBirth = isValidDateOfBirthInput(newProfileInfo.roles?.freelancer?.dateOfBirth);
        if (validDateOfBirth) {
            updatedProfileInfo.roles!.freelancer!.dateOfBirth = new Date(newProfileInfo.roles!.freelancer!.dateOfBirth!);
        }

        const validHourlyRate = isValidHourlyRateInput(newProfileInfo.roles?.freelancer?.hourlyRate);
        if (validHourlyRate) {
            updatedProfileInfo.roles!.freelancer!.hourlyRate = newProfileInfo.roles!.freelancer!.hourlyRate;
        }

        const validJobTitle = isValidJobTitleInput(newProfileInfo.roles?.freelancer?.jobTitle);
        if (validJobTitle) {
            updatedProfileInfo.roles!.freelancer!.jobTitle = newProfileInfo.roles!.freelancer!.jobTitle!.trim();
        }

        const validPortfolio = isValidPortfolioInput(newProfileInfo.roles?.freelancer?.portfolio);
        if (validPortfolio) {
            updatedProfileInfo.roles!.freelancer!.portfolio = newProfileInfo.roles!.freelancer!.portfolio!.trim();
        }

        const validGender = isValidGenderInput(newProfileInfo.roles?.freelancer?.gender);
        if (validGender) {
            updatedProfileInfo.roles!.freelancer!.gender = newProfileInfo.roles!.freelancer!.gender;
        }

        const validEnglishLevel = isValidEnglishLevelInput(newProfileInfo.roles?.freelancer?.englishLevel);
        if (validEnglishLevel) {
            updatedProfileInfo.roles!.freelancer!.englishLevel = newProfileInfo.roles!.freelancer!.englishLevel;
        }

        const validTypes = isValidTypesInput(newProfileInfo.roles?.freelancer?.types);
        if (validTypes) {
            updatedProfileInfo.roles!.freelancer!.types = newProfileInfo.roles!.freelancer!.types;
        }

        const validSkills = isValidSkillsInput(newProfileInfo.roles?.freelancer?.skills);
        if (validSkills) {
            updatedProfileInfo.roles!.freelancer!.skills = validSkills;
        }

        const validEducation = isValidEducationInput(newProfileInfo.roles?.freelancer?.education);
        if (validEducation) {
            updatedProfileInfo.roles!.freelancer!.education = newProfileInfo.roles!.freelancer!.education;
        }
    }


    if (userAs === "employer") {
        const validEmployees = isValidEmployeesInput(newProfileInfo.roles?.employer?.employees);
        if (validEmployees) {
            updatedProfileInfo.roles!.employer!.employees = newProfileInfo.roles!.employer!.employees;
        }

        const validCompany = isValidCompanyInput(newProfileInfo.roles?.employer?.companyName)
        if (validCompany) {
            updatedProfileInfo.roles!.employer!.companyName = newProfileInfo!.roles!.employer!.companyName!.trim();
        }

        const validWebsite = isValidWebsiteInput(newProfileInfo.roles?.employer?.website);
        if (validWebsite) {
            updatedProfileInfo.roles!.employer!.website = newProfileInfo!.roles!.employer!.website!.trim();
        }
    }

    return updatedProfileInfo;
}

export default getUpdatedProfileInfo;