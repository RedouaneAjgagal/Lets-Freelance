import { PrimaryButton } from '../../../layouts/brand';
import { FreelancerExperience } from '../services/getProfileInfo';
import { ExperienceError } from '../validators/editProfileValidators';
import EditSection from './EditSection';
import ExperienceList from './ExperienceList';
import { useState } from 'react';

type ExperienceWithId = FreelancerExperience & { id: string };

interface Props {
    fetchedExperience: ExperienceWithId[];
    experienceErrors: ExperienceError[] | null;
}

const ExperienceContainer = (props: React.PropsWithoutRef<Props>) => {
    const defaultExperience = { id: crypto.randomUUID(), title: "", company: "", startDate: "", endDate: "", description: "" }

    const initialExperienceList = props.fetchedExperience.length ? props.fetchedExperience : [defaultExperience];

    const [experienceList, setExperienceList] = useState(initialExperienceList);

    const addExperienceHandler = () => {
        setExperienceList(experienceList => [...experienceList, defaultExperience]);
    }

    const removeExperienceHandler = (experienceId: string) => {
        setExperienceList(experienceList => {
            if (experienceList.length === 1) return [defaultExperience];
            return experienceList.filter(exprience => exprience.id !== experienceId);
        });
    }

    return (
        <EditSection title='Experience' titleColor='black'>
            <ExperienceList experienceList={experienceList} onRemoveExperience={removeExperienceHandler} experienceErrors={props.experienceErrors} />
            <div>
                <PrimaryButton style='outline' onClick={addExperienceHandler} type="button" x="md" y="md" fullWith={false} justifyConent="start" disabled={false}>Add Experience</PrimaryButton>
            </div>
        </EditSection>
    )
}

export default ExperienceContainer