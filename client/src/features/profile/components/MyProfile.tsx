import InputContainer from "./InputContainer";
import EditSection from "./EditSection";
import { useAppSelector } from "../../../hooks/redux";
import SelectInputContainer from "./SelectInputContainer";

const role: "freelancer" | "employer" = "freelancer";

const MyProfile = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const changeEmailHandler = () => {
        console.log("Change email");

    }


    return (
        <EditSection title="Public Profile" titleColor="black">
            <div className="inline-flex">
                <label htmlFor="avatar" className="grid gap-2 cursor-pointer font-medium">
                    Featured Image
                    <img src={userInfo?.avatar} alt="" className="rounded w-24 h-24 object-cover border-2 border-dashed border-slate-400" />
                </label>
                <input type="file" name="avatar" id="avatar" className="sr-only" accept="image/*" />
            </div>
            <InputContainer name="name" label="full name" type="text" isError={false} errorMsg="something went wrong" defaultValue="" />
            <InputContainer name="email" label="Email" type="email" isError={false} errorMsg="something went wrong" defaultValue="email@gmail.com" readonly withBtn btnContent="Change" onConfirm={changeEmailHandler} />
            <InputContainer name="phone" label="Phone Number" type="number" isError={false} errorMsg="something went wrong" defaultValue="" />
            <InputContainer name="country" label="Country" type="text" isError={false} errorMsg="something went wrong" defaultValue="" />
            <SelectInputContainer label="Category" name="category" options={["digital marketing", "design & creative", "programming & tech", "writing & translation", "video & animation", "finance & accounting", "music & audio"]} defaultValue="digital marketing" />
            {role === "freelancer" ?
                <>
                    <InputContainer name="dateOfBirth" label="Date of Birth" type="date" isError={false} errorMsg="something went wrong" defaultValue="" />
                    <InputContainer name="hourlyRate" label="Hourly Rate ($)" type="number" isError={false} errorMsg="something went wrong" defaultValue="" />
                    <InputContainer name="jobTitle" label="Job Title" type="text" isError={false} errorMsg="something went wrong" defaultValue="" />
                    <InputContainer name="portfolio" label="Portfolio" type="text" isError={false} errorMsg="something went wrong" defaultValue="" />
                    <SelectInputContainer label="Gender" name="gender" options={["male", "female"]} defaultValue="male" />
                    <SelectInputContainer label="English Level" name="englishLevel" options={["basic", "conversational", "fluent", "native", "professional"]} defaultValue="conversational" />
                    <SelectInputContainer label="Type" name="types" options={["agency freelancers", "independent freelancers", "single freelancer"]} defaultValue="single freelancer" />
                </>
                :
                <>
                    <InputContainer name="employees" label="Employees" type="number" isError={false} errorMsg="something went wrong" defaultValue="1" />
                    <InputContainer name="company" label="Company Name" type="text" isError={false} errorMsg="something went wrong" defaultValue="" />
                    <InputContainer name="website" label="Website" type="text" isError={false} errorMsg="something went wrong" defaultValue="" />
                </>
            }
            <SelectInputContainer label="Show my Profile" name="showProfile" options={["Show", "Hide"]} defaultValue="Show" />
            <div className="flex flex-col gap-1">
                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" autoComplete="false" maxLength={1000} className="border-slate-300 border text-slate-600 rounded py-2 px-3 outline-none focus:border-slate-500 w-full resize-none min-h-[10rem]"></textarea>
            </div>
        </EditSection>
    )
}

export default MyProfile