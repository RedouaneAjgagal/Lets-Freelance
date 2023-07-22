import EditSection from './EditSection';
import { useState } from "react";
import InputContainer from './InputContainer';
import SkillsList from './SkillsList';
import { useAppDispatch } from '../../../hooks/redux';
import { profileSkillsAction } from '../redux/profileSkills';

const Skills = () => {
    const dispatch = useAppDispatch();
    const [skillValue, setSkillValue] = useState("");

    const addNewSkill = (skill: string) => {
        const generateId = crypto.randomUUID();
        const newSkill = {
            id: generateId,
            value: skill
        }
        dispatch(profileSkillsAction.addSkill(newSkill));
    }

    const addSkillhandler = () => {
        if (!skillValue || skillValue.trim() === "") return;
        addNewSkill(skillValue.trim());
        console.log("add skill");
        setSkillValue("")
    }

    const skillOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSkillValue(e.currentTarget.value);
    }


    return (
        <EditSection title="Skills" titleColor="black">
            <InputContainer value={skillValue} onChange={skillOnChange} errorMsg='Something went wrong' isError={false} label='Add New Skill' name='skill' type='text' withBtn onConfirm={addSkillhandler} btnContent="Add Skill" />
            <SkillsList />
        </EditSection>
    )
}

export default Skills