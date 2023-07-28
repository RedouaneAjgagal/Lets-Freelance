import InputContainer from "./InputContainer";
import EditSection from "./EditSection";
import { useAppSelector } from "../../../hooks/redux";
import SelectInputContainer from "./SelectInputContainer";
import useChangeEmailRequestMutation from "../hooks/useChangeEmailRequestMutation";
import { ProfileInput } from "./PublicProfileForm";
import ImageInputContainer from "./ImageInputContainer";
import { useState } from "react";

interface Props {
    profileInputInfo: ProfileInput;
    role: "freelancer" | "employer";
}

const MyProfile = (props: React.PropsWithoutRef<Props>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);


    const changeEmailRequestMutation = useChangeEmailRequestMutation();
    const changeEmailHandler = () => {
        console.log("Change email");
        changeEmailRequestMutation.mutate();
    }

    const [avatar, setAvatar] = useState(userInfo?.avatar);
    const uploadImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        console.log("upload new avatar");

    }

    return (
        <EditSection title="Public Profile" titleColor="black">
            <ImageInputContainer name="avatar" label="Featured Image" onUploadImage={uploadImageHandler} imageURL={avatar!} isError={props.profileInputInfo.avatar.isError} error={props.profileInputInfo.avatar.reason} isLoading={false} />
            <InputContainer name="name" label="full name" type="text" isError={props.profileInputInfo.name.isError} errorMsg={props.profileInputInfo.name.reason} defaultValue="reee" />
            <InputContainer name="email" label="Email" type="email" isError={false} errorMsg="something went wrong" defaultValue="email@gmail.com" readonly withBtn btnContent="Change" onConfirm={changeEmailHandler} />
            <InputContainer name="phoneNumber" label="Phone Number" type="number" isError={props.profileInputInfo.phoneNumber.isError} errorMsg={props.profileInputInfo.phoneNumber.reason} defaultValue="" />
            <InputContainer name="country" label="Country" type="text" isError={props.profileInputInfo.country.isError} errorMsg={props.profileInputInfo.country.reason} defaultValue="" />
            <SelectInputContainer label="Category" name="category" options={["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"]} defaultValue="digital marketing" isError={props.profileInputInfo.category.isError} error={props.profileInputInfo.category.reason} />
            {props.role === "freelancer" ?
                <>
                    <InputContainer name="dateOfBirth" label="Date of Birth" type="date" isError={props.profileInputInfo.dateOfBirth!.isError} errorMsg={props.profileInputInfo.dateOfBirth!.reason} defaultValue="2000-06-06" />
                    <InputContainer name="hourlyRate" label="Hourly Rate ($)" type="number" isError={props.profileInputInfo.hourlyRate!.isError} errorMsg={props.profileInputInfo.hourlyRate!.reason} defaultValue="10" />
                    <InputContainer name="jobTitle" label="Job Title" type="text" isError={props.profileInputInfo.jobTitle!.isError} errorMsg={props.profileInputInfo.jobTitle!.reason} defaultValue="" />
                    <InputContainer name="portfolio" label="Portfolio" type="text" isError={props.profileInputInfo.portfolio!.isError} errorMsg={props.profileInputInfo.portfolio!.reason} defaultValue="" />
                    <SelectInputContainer name="gender" label="Gender" options={["male", "female"]} defaultValue="male" isError={props.profileInputInfo.gender!.isError} error={props.profileInputInfo.gender!.reason} />
                    <SelectInputContainer name="englishLevel" label="English Level" options={["basic", "conversational", "fluent", "native", "professional"]} defaultValue="conversational" isError={props.profileInputInfo.englishLevel!.isError} error={props.profileInputInfo.englishLevel!.reason} />
                    <SelectInputContainer name="types" label="Type" options={["agency freelancers", "independent freelancers", "single freelancer"]} defaultValue="single freelancer" isError={props.profileInputInfo.types!.isError} error={props.profileInputInfo.types!.reason} />
                </>
                :
                <>
                    <InputContainer name="employees" label="Employees" type="number" isError={props.profileInputInfo.employees!.isError} errorMsg={props.profileInputInfo.employees!.reason} defaultValue="1" />
                    <InputContainer name="companyName" label="Company Name" type="text" isError={props.profileInputInfo.companyName!.isError} errorMsg={props.profileInputInfo.companyName!.reason} defaultValue="" />
                    <InputContainer name="website" label="Website" type="text" isError={props.profileInputInfo.website!.isError} errorMsg={props.profileInputInfo.website!.reason} defaultValue="" />
                </>
            }
            <SelectInputContainer name="showProfile" label="Show my Profile" options={["show", "hide"]} defaultValue="Show" isError={props.profileInputInfo.showProfile.isError} error={props.profileInputInfo.showProfile.reason} />
            <div className="flex flex-col gap-1">
                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" autoComplete="false" maxLength={1000} className="border-slate-300 border text-slate-600 rounded py-2 px-3 outline-none focus:border-slate-500 w-full resize-none min-h-[10rem]"></textarea>
            </div>
        </EditSection>
    )
}

export default MyProfile