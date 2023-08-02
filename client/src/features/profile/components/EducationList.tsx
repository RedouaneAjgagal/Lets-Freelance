import Education from "./Education";
import { TEducation } from "./EducationContainer";
import { EducationError } from "../validators/editProfileValidators";

interface Props {
    educationList: TEducation[];
    educationErrors: EducationError[] | null;
    onRemoveEducation: (educationId: string) => void
}

const EducationList = (props: React.PropsWithoutRef<Props>) => {
    return (
        <ul className="flex flex-col gap-4">
            {props.educationList.map((education, index) => <Education key={education.id} educationInfo={education} educationIndex={index} educationError={props.educationErrors?.find((e) => e.id === education.id)!} onRemoveEducation={props.onRemoveEducation} />)}
        </ul>
    )
}

export default EducationList