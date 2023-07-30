import EditSection from './EditSection';
import { useState, useEffect } from "react";
import InputContainer from './InputContainer';
import SkillsList from './SkillsList';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { profileSkillsAction } from '../redux/profileSkills';

interface Props {
    fetchedSkills: string[];
}

const Skills = (props: React.PropsWithoutRef<Props>) => {
    const dispatch = useAppDispatch();
    const { skills } = useAppSelector(state => state.profileSkillsReducer);
    const [skillValue, setSkillValue] = useState("");
    const getAllSkills = props.fetchedSkills.map(skill => {
        return { id: crypto.randomUUID(), value: skill }
    });
    useEffect(() => {
        dispatch(profileSkillsAction.initialSkills(getAllSkills))
    }, []);


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
        setSkillValue("");
    }

    const skillOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSkillValue(e.currentTarget.value);
    }


    return (
        <EditSection title="Skills" titleColor="black">
            <InputContainer onChange={skillOnChange} value={skillValue} isError={false} errorMsg="" label='Add New Skill' name='skills' type='text' withBtn onConfirm={skills.length < 10 ? addSkillhandler : undefined} btnContent="Add Skill" disabled={skills.length >= 10} />
            <SkillsList />
        </EditSection>
    )
}

export default Skills