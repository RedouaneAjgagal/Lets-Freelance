import { BsFillCaretDownFill } from "react-icons/bs";
import { useState } from "react";
import { ExperienceError } from "../validators/editProfileValidators";
import { ExperienceWithId } from "./ExperienceList";
import InputContainer from "./InputContainer";

interface Props {
    experience: ExperienceWithId;
    index: number;
    error: ExperienceError | null;
    onRemoveExperience: (educationId: string) => void;
}

const Experience = (props: React.PropsWithoutRef<Props>) => {
    const [isExperienceOpen, setIsExperienceOpen] = useState(props.index === 0 ? true : false);

    const removeExperienceHandler = () => {
        props.onRemoveExperience(props.experience.id);
    }
    return (
        <li>
            <button type="button" onClick={() => setIsExperienceOpen(prev => !prev)} className={`flex items-center justify-between px-2 py-3 w-full border rounded font-medium text-slate-700 ${isExperienceOpen && "rounded-b-none"} ${false ? "border-red-600" : "border-slate-300"}`}>
                {`Experience ${props.index + 1}`}
                <BsFillCaretDownFill className={`text-sm duration-200 ${isExperienceOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`bg-white w-full z-20 top-13 flex flex-col gap-5 px-5 pt-4 pb-6 border border-t-0 rounded-b ${!isExperienceOpen && "hidden"} ${false ? "border-red-600" : "border-slate-300"}`}>
                <InputContainer label="Title" name={`experience-title/${props.experience.id}`} type="text" placeHolder="e.g. Frontend Role" defaultValue={props.experience.title} isError={props.error?.title ? true : false} errorMsg={props.error?.title || ""} />
                <InputContainer label="Company" name={`experience-company/${props.experience.id}`} type="text" placeHolder="e.g. Upwork" defaultValue={props.experience.company} isError={props.error?.company ? true : false} errorMsg={props.error?.company || ""} />
                <InputContainer label="Start Date" name={`experience-startDate/${props.experience.id}`} type="text" placeHolder="e.g. 2022/08" defaultValue={props.experience.startDate} isError={props.error?.startDate ? true : false} errorMsg={props.error?.startDate || ""} />
                <InputContainer label="End Date" name={`experience-endDate/${props.experience.id}`} type="text" placeHolder="e.g. 2023/06" defaultValue={props.experience.endDate} isError={props.error?.endDate ? true : false} errorMsg={props.error?.endDate || ""} />
                <div className="flex flex-col gap-1 relative">
                    <label htmlFor={`experience-description/${props.experience.id}`} className="font-medium">Description</label>
                    <textarea name={`experience-description/${props.experience.id}`} id={`experience-description/${props.experience.id}`} rows={4} defaultValue={props.experience.description} className={`border text-slate-600 rounded py-2 px-3 outline-none w-full focus:border-slate-500 ${props.error?.description ? "border-red-600" : "border-slate-300"}`} maxLength={300}></textarea>
                    {props.error?.description ?
                        <p className="text-sm absolute -bottom-5 right-0 text-red-600">{props.error.description}</p>
                        :
                        null
                    }
                </div>
                <div className="flex justify-end mt-2">
                    <button type="button" onClick={removeExperienceHandler} className="text-white bg-red-600 px-2 py-1 rounded">Remove Experience</button>
                </div>
            </div>
            <input type="text" name="experienceId" value={props.experience.id} hidden readOnly className="sr-only" />
        </li>
    )
}

export default Experience