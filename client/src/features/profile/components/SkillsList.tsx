import { useAppSelector } from '../../../hooks/redux';
import Skill from './Skill';

const SkillsList = () => {
    const { skills } = useAppSelector(state => state.profileSkillsReducer);
    return (
        <ul className='flex items-center gap-3 flex-wrap'>
            {skills.map(skill => <Skill key={skill.id} skill={skill} />)}
        </ul>
    )
}

export default SkillsList