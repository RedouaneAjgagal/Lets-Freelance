import MyProfile from "./MyProfile"
import Skills from "./Skills";
import { PrimaryButton } from "../../../layouts/brand";
import { BiArrowBack } from "react-icons/bi";
import { nameValidation, phoneNumberValidation, hourlyRateValidation, avatarValidation, categoryValidation, companyNameValidation, countryValidation, dateOfBirthValidation, descriptionValidation, employeesValidation, englishLevelValidation, genderValidation, jobTitleValidation, portfolioValidation, showProfileValidation, skillsValidation, typesValidation, websiteValidation, educationValidation, EducationError, ExperienceError, experienceValidation } from "../validators/editProfileValidators";
import { useState } from "react";
import { useAppSelector } from "../../../hooks/redux";
import useUpdateProfileMutation from "../hooks/useUpdateProfileMutation";
import { UpdatedProfileData } from "../services/updateProfile";
import { ProfileInfo } from "../services/getProfileInfo";
import { useIsMutating } from "@tanstack/react-query";
import EducationContainer from "./EducationContainer";
import ExperienceContainer from "./ExperienceContainer";

type GeneralUpdatedKeys = "avatar" | "name" | "phoneNumber" | "country" | "category" | "description";

type ProfileInputError = {
    isError: boolean;
    reason: string;
}

type GeneralInputError = {
    avatar: ProfileInputError;
    avatarUploader: ProfileInputError;
    name: ProfileInputError;
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

interface Props {
    profileInfo: ProfileInfo;
}

const PublicProfileForm = (props: React.PropsWithoutRef<Props>) => {

    const { skills } = useAppSelector(state => state.profileSkillsReducer);
    const [formErrors, setFormErrors] = useState<{
        educationError: EducationError[] | null;
        experienceError: ExperienceError[] | null;
    }>({ educationError: null, experienceError: null });
    const isUploadingAvatar = useIsMutating(["uploadAvatar"]);

    const errorInfo = { isError: false, reason: "" }
    const [profileInputInfo, setProfileInputInfo] = useState<ProfileInput>({
        name: errorInfo,
        avatar: errorInfo,
        category: errorInfo,
        country: errorInfo,
        description: errorInfo,
        phoneNumber: errorInfo,
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

        const educationList = formData.getAll("educationId").map(educationId => {
            const getTitleId = `education-title/${educationId}`;
            const getAcademyId = `education-academy/${educationId}`;
            const getYearId = `education-year/${educationId}`;
            const getDescriptionId = `education-description/${educationId}`;
            const educationInfo = {
                id: educationId.toString(),
                title: formData.get(getTitleId)!.toString(),
                academy: formData.get(getAcademyId)!.toString(),
                year: formData.get(getYearId)!.toString(),
                description: formData.get(getDescriptionId)!.toString()
            }
            return educationInfo;
        });

        const educationListWithoutId = educationList.map(education => {
            return { title: education.title, academy: education.academy, year: education.year, description: education.description }
        })


        const ExperienceList = formData.getAll("experienceId").map(experienceId => {
            const getTitleId = `experience-title/${experienceId}`;
            const getCompanyId = `experience-company/${experienceId}`;
            const getStartDateId = `experience-startDate/${experienceId}`;
            const getEndDateId = `experience-endDate/${experienceId}`;
            const getDescriptionId = `experience-description/${experienceId}`;
            const experienceInfo = {
                id: experienceId.toString(),
                title: formData.get(getTitleId)!.toString(),
                company: formData.get(getCompanyId)!.toString(),
                startDate: formData.get(getStartDateId)!.toString(),
                endDate: formData.get(getEndDateId)!.toString(),
                description: formData.get(getDescriptionId)!.toString()
            }
            return experienceInfo;
        });

        const ExperienceListWithoutId = ExperienceList.map(experience => {
            return { title: experience.title, company: experience.company, startDate: experience.startDate, endDate: experience.endDate, description: experience.description }
        })

        const generalData = {
            avatar: formData.get("avatar")!.toString(),
            name: formData.get("name")!.toString(),
            phoneNumber: Number(formData.get("phoneNumber")!.toString()),
            country: formData.get("country")!.toString(),
            category: formData.get("category")!.toString(),
            description: formData.get("description")!.toString()
        }

        const freelancer = {
            dateOfBirth: formData.get("dateOfBirth")?.toString(),
            hourlyRate: Number(formData.get("hourlyRate")?.toString()),
            jobTitle: formData.get("jobTitle")?.toString(),
            portfolio: formData.get("portfolio")?.toString(),
            gender: formData.get("gender")?.toString(),
            englishLevel: formData.get("englishLevel")?.toString(),
            types: formData.get("types")?.toString(),
            skills: skills.map(skill => skill.value),
            education: educationListWithoutId,
            experience: ExperienceListWithoutId
        }

        const employer = {
            employees: formData.get("employees")?.toString(),
            companyName: formData.get("companyName")?.toString(),
            website: formData.get("website")?.toString()
        }

        const roleData = props.profileInfo.userAs === "freelancer" ? { freelancer } : { employer };
        const profileData = { ...generalData, ...roleData.employer, ...roleData.freelancer }

        let isValidForm = true;
        for (const key in profileData) {
            if (key === "education" || key === "experience") continue;
            const getKey = key as GeneralUpdatedKeys;
            const value = profileData[getKey];
            const validation = validators[`${getKey}Validation`] as (value: string | number | boolean) => { isError: boolean; reason: string };
            const result = { [getKey]: validation(value) };
            if (result[getKey].isError) {
                isValidForm = false;
            }
            setProfileInputInfo(prev => {
                return { ...prev, ...result }
            });
        }

        const educationErrors = educationValidation(educationList);
        const experienceErrors = experienceValidation(ExperienceList);

        const isValidEducation = educationErrors.every(errorKey => {
            return Object.entries(errorKey).every(([key, value]) => {
                if (key === "id") return true;
                return value === "";
            })
        });

        const isValidExperience = experienceErrors.every(errorKey => {
            return Object.entries(errorKey).every(([key, value]) => {
                if (key === "id") return true;
                return value === "";
            });
        })
        setFormErrors({ educationError: educationErrors, experienceError: experienceErrors });

        if (!isValidForm || !isValidEducation || !isValidExperience) return;

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
            <MyProfile profileInfo={props.profileInfo} profileInputInfo={profileInputInfo} />
            {props.profileInfo.userAs === "freelancer"
                ? <>
                    <EducationContainer fetchedEducationList={props.profileInfo.roles.freelancer!.education.map(education => ({ ...education, id: crypto.randomUUID() }))} educationErrors={formErrors.educationError} />
                    <ExperienceContainer fetchedExperience={props.profileInfo.roles!.freelancer!.experience.map(experience => ({ ...experience, id: crypto.randomUUID() }))} experienceErrors={formErrors.experienceError} />
                    <Skills fetchedSkills={props.profileInfo.roles.freelancer!.skills} />
                </>
                : null
            }
            <div>
                <PrimaryButton isLoading={updateProfileMutation.isLoading} style="solid" disabled={updateProfileMutation.isLoading || isUploadingAvatar === 1} fullWith={false} justifyConent="center" type="submit" x="lg" y="md">
                    Save Profile
                    <BiArrowBack className="rotate-[135deg]" size="1.1rem" />
                </PrimaryButton>
            </div>
        </form>
    )
}

export default PublicProfileForm