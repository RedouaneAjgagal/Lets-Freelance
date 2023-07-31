import InputContainer from "./InputContainer";
import EditSection from "./EditSection";
import SelectInputContainer from "./SelectInputContainer";
import useChangeEmailRequestMutation from "../hooks/useChangeEmailRequestMutation";
import { ProfileInput } from "./PublicProfileForm";
import ImageInputContainer from "./ImageInputContainer";
import { useState, useEffect } from "react";
import { ProfileInfo } from "../services/getProfileInfo";
import useUploadAvatarMutation from "../hooks/useUploadAvatarMutation";

interface Props {
    profileInputInfo: ProfileInput;
    profileInfo: ProfileInfo
}

const MyProfile = (props: React.PropsWithoutRef<Props>) => {
    const changeEmailRequestMutation = useChangeEmailRequestMutation();
    const changeEmailHandler = () => {
        changeEmailRequestMutation.mutate();
    }

    const uploadAvatarMutation = useUploadAvatarMutation();
    const [avatar, setAvatar] = useState(props.profileInfo.avatar);
    const uploadImageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const avatar = e.currentTarget.files?.item(0);
        const maxSize = 1024 * 1024;
        if (!avatar) {
            return;
        }
        if (!avatar.type.startsWith("image") || avatar.type.startsWith("image/svg")) {
            return;
        }
        if (avatar?.size > maxSize) {
            return;
        }

        uploadAvatarMutation.mutate(avatar);
    }

    const dateOfBirth = props.profileInfo.roles.freelancer?.dateOfBirth ? new Date(props.profileInfo.roles.freelancer?.dateOfBirth).toISOString().split("T")[0] : undefined;

    useEffect(() => {
        if (uploadAvatarMutation.isSuccess) {
            setAvatar(uploadAvatarMutation.data.data.avatarURL);
        }
    }, [uploadAvatarMutation.isSuccess]);

    return (
        <EditSection title="Public Profile" titleColor="black">
            <ImageInputContainer name="avatar" label="Featured Image" onUploadImage={uploadImageHandler} imageURL={avatar} isError={props.profileInputInfo.avatar.isError} error={props.profileInputInfo.avatar.reason} isLoading={uploadAvatarMutation.isLoading} />
            <InputContainer name="name" label="full name" type="text" isError={props.profileInputInfo.name.isError} errorMsg={props.profileInputInfo.name.reason} defaultValue={props.profileInfo.name} />
            <InputContainer name="email" label="Email" type="email" isError={false} errorMsg="something went wrong" defaultValue={props.profileInfo.user.email} readonly withBtn btnContent="Change" onConfirm={changeEmailHandler} />
            <InputContainer name="phoneNumber" label="Phone Number" type="number" isError={props.profileInputInfo.phoneNumber.isError} errorMsg={props.profileInputInfo.phoneNumber.reason} defaultValue={props.profileInfo.phoneNumber?.toString()} />
            <InputContainer name="country" label="Country" type="text" isError={props.profileInputInfo.country.isError} errorMsg={props.profileInputInfo.country.reason} defaultValue={props.profileInfo.country} />
            <SelectInputContainer label="Category" name="category" options={["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"]} defaultValue={props.profileInfo.category} isError={props.profileInputInfo.category.isError} error={props.profileInputInfo.category.reason} />
            {props.profileInfo.userAs === "freelancer" ?
                <>
                    <InputContainer name="dateOfBirth" label="Date of Birth" type="date" isError={props.profileInputInfo.dateOfBirth!.isError} errorMsg={props.profileInputInfo.dateOfBirth!.reason} defaultValue={dateOfBirth} />
                    <InputContainer name="hourlyRate" label="Hourly Rate ($)" type="number" isError={props.profileInputInfo.hourlyRate!.isError} errorMsg={props.profileInputInfo.hourlyRate!.reason} defaultValue={props.profileInfo.roles.freelancer!.hourlyRate} />
                    <InputContainer name="jobTitle" label="Job Title" type="text" isError={props.profileInputInfo.jobTitle!.isError} errorMsg={props.profileInputInfo.jobTitle!.reason} defaultValue={props.profileInfo.roles.freelancer!.jobTitle} />
                    <InputContainer name="portfolio" label="Portfolio" type="text" isError={props.profileInputInfo.portfolio!.isError} errorMsg={props.profileInputInfo.portfolio!.reason} defaultValue={props.profileInfo.roles.freelancer!.portfolio} />
                    <SelectInputContainer name="gender" label="Gender" options={["male", "female"]} defaultValue={props.profileInfo.roles.freelancer!.gender} isError={props.profileInputInfo.gender!.isError} error={props.profileInputInfo.gender!.reason} />
                    <SelectInputContainer name="englishLevel" label="English Level" options={["basic", "conversational", "fluent", "native", "professional"]} defaultValue={props.profileInfo.roles.freelancer!.englishLevel} isError={props.profileInputInfo.englishLevel!.isError} error={props.profileInputInfo.englishLevel!.reason} />
                    <SelectInputContainer name="types" label="Type" options={["agency freelancers", "independent freelancers", "single freelancer"]} defaultValue={props.profileInfo.roles.freelancer!.types} isError={props.profileInputInfo.types!.isError} error={props.profileInputInfo.types!.reason} />
                </>
                :
                <>
                    <InputContainer name="employees" label="Employees" type="number" isError={props.profileInputInfo.employees!.isError} errorMsg={props.profileInputInfo.employees!.reason} defaultValue={props.profileInfo.roles.employer!.employees} />
                    <InputContainer name="companyName" label="Company Name" type="text" isError={props.profileInputInfo.companyName!.isError} errorMsg={props.profileInputInfo.companyName!.reason} defaultValue={props.profileInfo.roles.employer!.companyName} />
                    <InputContainer name="website" label="Website" type="text" isError={props.profileInputInfo.website!.isError} errorMsg={props.profileInputInfo.website!.reason} defaultValue={props.profileInfo.roles.employer!.website} />
                </>
            }
            <SelectInputContainer name="showProfile" label="Show my Profile" options={["show", "hide"]} defaultValue={props.profileInfo.showProfile ? "show" : "hide"} isError={props.profileInputInfo.showProfile.isError} error={props.profileInputInfo.showProfile.reason} />
            <div className="flex flex-col gap-1">
                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" autoComplete="false" maxLength={1000} defaultValue={props.profileInfo.description} className="border-slate-300 border text-slate-600 rounded py-2 px-3 outline-none focus:border-slate-500 w-full resize-none min-h-[10rem]"></textarea>
            </div>
        </EditSection>
    )
}

export default MyProfile