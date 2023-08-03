import { FreelancerExperience } from "../services/getProfileInfo";
import { ExperienceError } from "../validators/editProfileValidators";
import Experience from "./Experience";
export type ExperienceWithId = FreelancerExperience & { id: string };

interface Props {
    experienceList: ExperienceWithId[];
    experienceErrors: ExperienceError[] | null
    onRemoveExperience: (experienceId: string) => void;
}

const ExperienceList = (props: React.PropsWithoutRef<Props>) => {

    return (
        <ul className="flex flex-col gap-4">
            {props.experienceList.map((experience, index) => <Experience key={experience.id} error={props.experienceErrors?.find(error => error.id === experience.id)!} index={index} experience={experience} onRemoveExperience={props.onRemoveExperience} />)}
        </ul>
    )
}

export default ExperienceList