import React from 'react'
import SingleProfileEducation from './SingleProfileEducation'

interface Props {
    educations: {
        title: string;
        academy: string;
        year: string;
        description: string;
    }[]
}

const ProfileEducation = (props: React.PropsWithoutRef<Props>) => {
    return (
        <div className='p-4'>
            <section className='border-t py-4'>
                <h2 className="font-medium text-2xl pt-3 pb-4">Education</h2>
                <ul className="flex flex-col gap-2">
                    {props.educations.length ?
                        props.educations.map((education, index) => <SingleProfileEducation key={index} educationInfo={education} isLastEducation={props.educations.length === index + 1} />)
                        :
                        <p className='text-slate-500'>Empty..</p>
                    }
                </ul>
            </section>
        </div>
    )
}

export default ProfileEducation