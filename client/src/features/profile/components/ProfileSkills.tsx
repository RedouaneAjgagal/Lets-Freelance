import React from 'react'

interface Props {
    skills: string[];
}

const ProfileSkills = (props: React.PropsWithoutRef<Props>) => {

    const searchSkill = (skill: string) => {
        console.log(skill);
    }

    return (
        <section className='p-4'>
            <div className='flex flex-col gap-4 border px-4 py-6 rounded'>
                <h3 className='font-medium text-2xl'>My Skills</h3>
                <div className='flex items-center flex-wrap gap-x-2 gap-y-3'>
                    {props.skills.map((skill, index) => <button key={index} onClick={searchSkill.bind(null, skill)} className="bg-purple-100/60 py-1 px-3 rounded-full border">{skill}</button>)}
                </div>
            </div>
        </section>
    )
}

export default ProfileSkills