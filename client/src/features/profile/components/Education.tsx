import { useState } from "react";
import { BsFillCaretDownFill } from 'react-icons/bs';
import { TEducation } from "./EducationContainer";
import { EducationError } from "../validators/editProfileValidators";
import InputContainer from "./InputContainer";

interface Props {
    educationInfo: TEducation;
    educationIndex: number;
    educationError: EducationError | null;
    onRemoveEducation: (educationId: string) => void
}

const Education = (props: React.PropsWithoutRef<Props>) => {
    const [isEducationOpen, setIsEducationOpen] = useState(props.educationIndex === 0 ? true : false);

    const hasInvalidValue = Object.entries(props.educationError || true).some(([key, value]) => {
        if (key === "id") return false;
        return value !== "";
    });

    const removeEducationHandler = () => {
        props.onRemoveEducation(props.educationInfo.id);
    }

    return (
        <li>
            <button type="button" onClick={() => setIsEducationOpen(prev => !prev)} className={`flex items-center justify-between px-2 py-3 w-full border rounded font-medium text-slate-700 ${isEducationOpen && "rounded-b-none"} ${hasInvalidValue ? "border-red-600" : "border-slate-300"}`}>
                {`Education ${props.educationIndex + 1}`}
                <BsFillCaretDownFill className={`text-sm duration-200 ${isEducationOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`bg-white w-full z-20 top-13 flex flex-col gap-5 px-5 pt-4 pb-6 border border-t-0 rounded-b ${!isEducationOpen && "hidden"} ${hasInvalidValue ? "border-red-600" : "border-slate-300"}`}>
                <InputContainer label="Title" name={`education-title/${props.educationInfo.id}`} type="text" placeHolder="e.g. Computer Science" defaultValue={props.educationInfo.title} isError={props.educationError?.title ? true : false} errorMsg={props.educationError?.title || ""} />
                <InputContainer label="Academy" name={`education-academy/${props.educationInfo.id}`} type="text" placeHolder="e.g. Harvard" defaultValue={props.educationInfo.academy} isError={props.educationError?.academy ? true : false} errorMsg={props.educationError?.academy || ""} />
                <InputContainer label="Year" name={`education-year/${props.educationInfo.id}`} type="text" placeHolder="e.g. 2018-2022" defaultValue={props.educationInfo.year} isError={props.educationError?.year ? true : false} errorMsg={props.educationError?.year || ""} />
                <div className="flex flex-col gap-1 relative">
                    <label htmlFor={`education-description/${props.educationInfo.id}`} className="font-medium flex items-center gap-1">Description<span className="text-red-600">*</span></label>
                    <textarea name={`education-description/${props.educationInfo.id}`} id={`education-description/${props.educationInfo.id}`} rows={4} defaultValue={props.educationInfo.description} className={`border text-slate-600 rounded py-2 px-3 outline-none w-full focus:border-slate-500 ${props.educationError?.description ? "border-red-600" : "border-slate-300"}`} maxLength={300}></textarea>
                    {props.educationError?.description ?
                        <p className="text-sm absolute -bottom-5 right-0 text-red-600">{props.educationError.description}</p>
                        :
                        null
                    }
                </div>
                <div className="flex justify-end mt-2">
                    <button type="button" onClick={removeEducationHandler} className="text-white bg-red-600 px-2 py-1 rounded">Remove Education</button>
                </div>
            </div>
            <input type="text" name="educationId" value={props.educationInfo.id} hidden readOnly className="sr-only" />
        </li>
    )
}

export default Education