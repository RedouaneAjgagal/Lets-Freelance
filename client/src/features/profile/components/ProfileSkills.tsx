import React from 'react'
import { useNavigate } from 'react-router-dom';

interface Props {
    skills: string[];
}

const ProfileSkills = (props: React.PropsWithoutRef<Props>) => {
    const navigate = useNavigate();

    const searchSkill = (skill: string) => {
        navigate(`/profiles?search=${skill}`);
    }

    return (
        <section className='p-4'>
            <div className='flex flex-col gap-4 border px-4 py-6 rounded xl:shadow-sm xl:p-6'>
                <h3 className='font-medium text-2xl'>My Skills</h3>
                <div className='flex items-center flex-wrap gap-x-2 gap-y-3'>
                    {props.skills.length ?
                        props.skills.map((skill, index) => <button key={index} onClick={searchSkill.bind(null, skill)} className="bg-purple-100/60 py-1 px-3 rounded-full border">{skill}</button>)
                        :
                        <p className='text-slate-500'>Empty..</p>
                    }
                </div>
            </div>
        </section>
    )
}

export default ProfileSkills