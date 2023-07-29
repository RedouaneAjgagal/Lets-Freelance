import MyProfile from "./MyProfile"
import Skills from "./Skills";
import { PrimaryButton } from "../../../layouts/brand";
import { BiArrowBack } from "react-icons/bi";
import { nameValidation, phoneNumberValidation, hourlyRateValidation, avatarValidation, categoryValidation, companyNameValidation, countryValidation, dateOfBirthValidation, descriptionValidation, employeesValidation, englishLevelValidation, genderValidation, jobTitleValidation, portfolioValidation, showProfileValidation, skillsValidation, typesValidation, websiteValidation } from "../validators/editProfileValidators";
import { useState } from "react";
import { useAppSelector } from "../../../hooks/redux";
import useUpdateProfileMutation from "../hooks/useUpdateProfileMutation";
import { UpdatedProfileData } from "../services/updateProfile";

type GeneralUpdatedKeys = "avatar" | "name" | "phoneNumber" | "country" | "category" | "description" | "showProfile";

type ProfileInputError = {
    isError: boolean;
    reason: string;
}

type GeneralInputError = {
    avatar: ProfileInputError;
    avatarUploader: ProfileInputError;
    name: ProfileInputError;
    showProfile: ProfileInputError;
    country: ProfileInputError;
    phoneNumber: ProfileInputError;
    description: ProfileInputError;
    category: ProfileInputError;
}

type FreelancerInputError = {
    dateOfBirth: ProfileInputError;
    hourlyRate: ProfileInputError;
    jobTitle: ProfileInputError;
    portfolio: ProfileInputError;
    gender: ProfileInputError;
    englishLevel: ProfileInputError;
    types: ProfileInputError;
    skills: ProfileInputError;
}

type EmployerInputError = {
    employees: ProfileInputError;
    companyName: ProfileInputError;
    website: ProfileInputError;
}

export type ProfileInput = GeneralInputError & Partial<FreelancerInputError & EmployerInputError>

const validators = {
    nameValidation,
    phoneNumberValidation,
    hourlyRateValidation,
    avatarValidation,
    categoryValidation,
    companyNameValidation,
    countryValidation,
    dateOfBirthValidation,
    descriptionValidation,
    employeesValidation,
    englishLevelValidation,
    genderValidation,
    jobTitleValidation,
    portfolioValidation,
    showProfileValidation,
    skillsValidation,
    typesValidation,
    websiteValidation
}

const role: "freelancer" | "employer" = "freelancer";

const PublicProfileForm = () => {
    const { skills } = useAppSelector(state => state.profileSkillsReducer);
    const errorInfo = { isError: false, reason: "" }
    const [profileInputInfo, setProfileInputInfo] = useState<ProfileInput>({
        name: errorInfo,
        avatar: errorInfo,
        category: errorInfo,
        country: errorInfo,
        description: errorInfo,
        phoneNumber: errorInfo,
        showProfile: errorInfo,
        companyName: errorInfo,
        dateOfBirth: errorInfo,
        employees: errorInfo,
        englishLevel: errorInfo,
        gender: errorInfo,
        hourlyRate: errorInfo,
        jobTitle: errorInfo,
        portfolio: errorInfo,
        types: errorInfo,
        website: errorInfo,
        avatarUploader: errorInfo,
        skills: errorInfo
    });


    const updateProfileMutation = useUpdateProfileMutation();

    const updateProfileHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const generalData = {
            avatar: formData.get("avatar")!.toString(),
            name: formData.get("name")!.toString(),
            phoneNumber: Number(formData.get("phoneNumber")!.toString()),
            country: formData.get("country")!.toString(),
            category: formData.get("category")!.toString(),
            description: formData.get("description")!.toString(),
            showProfile: formData.get("showProfile")!.toString() === "hide" ? false : true
        }

        const freelancer = {
            dateOfBirth: formData.get("dateOfBirth")?.toString(),
            hourlyRate: Number(formData.get("hourlyRate")?.toString()),
            jobTitle: formData.get("jobTitle")?.toString(),
            portfolio: formData.get("portfolio")?.toString(),
            gender: formData.get("gender")?.toString(),
            englishLevel: formData.get("englishLevel")?.toString(),
            types: formData.get("types")?.toString(),
            skills: skills.map(skill => skill.value)
        }

        const employer = {
            employees: formData.get("employees")?.toString(),
            companyName: formData.get("companyName")?.toString(),
            website: formData.get("website")?.toString()
        }

        const roleData = role === "freelancer" ? { freelancer } : { employer };
        const profileData = { ...generalData, ...roleData.employer, ...roleData.freelancer }

        let isValidForm = true;
        for (const key in profileData) {
            const getKey = key as GeneralUpdatedKeys;
            const value = profileData[getKey];
            const validation = validators[`${getKey}Validation`] as (value: string | number | boolean) => { isError: boolean; reason: string };
            const result = { [getKey]: validation(value) };
            if (result[getKey].isError) {
                console.log(result[getKey]);
                isValidForm = false;
            }
            setProfileInputInfo(prev => {
                return { ...prev, ...result }
            });
        }

        if (!isValidForm) return;

        const updatedData = {
            profileInfo: {
                ...generalData,
                roles: roleData
            }
        } as UpdatedProfileData

        updateProfileMutation.mutate(updatedData);
    }

    return (
        <form onSubmit={updateProfileHandler} className="flex flex-col gap-4 mb-4">
            <MyProfile profileInputInfo={profileInputInfo} role={role} />
            <Skills />
            <PrimaryButton disabled={false} fullWith={false} justifyConent="start" type="submit" x="md" y="md">Save Profile <BiArrowBack className="rotate-[135deg]" size="1.1rem" /></PrimaryButton>
        </form>
    )
}

export default PublicProfileForm