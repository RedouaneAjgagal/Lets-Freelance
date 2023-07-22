import React from 'react'
import { useAppDispatch } from '../../../hooks/redux';
import { profileSkillsAction } from '../redux/profileSkills';
import { BiX } from 'react-icons/bi';

interface Props {
    skill: {
        id: string;
        value: string;
    };
}

const Skill = (props: React.PropsWithoutRef<Props>) => {
    const dispatch = useAppDispatch();

    const removeSkillHandler = () => {
        dispatch(profileSkillsAction.removeSkill({ skillId: props.skill.id }));
    }

    return (
        <li className='relative bg-purple-100 rounded py-2 px-2 shadow-purple-300 shadow-sm'>
            <button onClick={removeSkillHandler} type='button' className='border border-slate-900 rounded-full absolute -top-2 -left-2'><BiX size="1rem" /></button>
            {props.skill.value}
        </li>
    )
}

export default Skill