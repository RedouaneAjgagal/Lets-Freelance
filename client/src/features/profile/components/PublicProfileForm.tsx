import MyProfile from "./MyProfile"
import Skills from "./Skills";
import { PrimaryButton } from "../../../layouts/brand";
import { BiArrowBack } from "react-icons/bi";


const PublicProfileForm = () => {
    const updateProfileHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(true);

    }

    return (
        <form onSubmit={updateProfileHandler} className="flex flex-col gap-4 mb-4">
            <MyProfile />
            <Skills />
            <PrimaryButton disabled={false} fullWith={false} justifyConent="start" type="submit" x="md" y="md">Save Profile <BiArrowBack className="rotate-[135deg]" size="1.1rem" /></PrimaryButton>
        </form>
    )
}

export default PublicProfileForm