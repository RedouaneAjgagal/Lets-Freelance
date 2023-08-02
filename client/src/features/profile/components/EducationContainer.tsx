import { PrimaryButton } from "../../../layouts/brand";
import EditSection from "./EditSection";
import { useState } from "react";
import EducationList from "./EducationList";
import { EducationError } from "../validators/editProfileValidators";

export type TEducation = {
    id: string;
    title: string;
    academy: string;
    year: string;
    description: string;
}

interface Props {
    fetchedEducationList: TEducation[];
    educationErrors: EducationError[] | null;
}

const EducationContainer = (props: React.PropsWithoutRef<Props>) => {
    const defultEducation: TEducation = { year: "", title: "", academy: "", description: "", id: crypto.randomUUID() };

    const initialEducationList = props.fetchedEducationList.length ? props.fetchedEducationList : [defultEducation];

    const [educationList, setEducationList] = useState<TEducation[]>(initialEducationList);

    const addEducationHandler = () => {
        setEducationList(prev => [...prev, defultEducation]);
    }

    const removeEducationHandler = (educationId: string) => {
        setEducationList(educationList => {
            if (educationList.length === 1) return [defultEducation]
            return educationList.filter(education => education.id !== educationId);
        });
    }

    return (
        <EditSection title="Education" titleColor="black">
            <EducationList educationList={educationList} educationErrors={props.educationErrors} onRemoveEducation={removeEducationHandler} />
            <div>
                <PrimaryButton onClick={addEducationHandler} type="button" x="md" y="md" fullWith={false} justifyConent="start" disabled={false}>Add Education</PrimaryButton>
            </div>
        </EditSection>
    )
}

export default EducationContainer