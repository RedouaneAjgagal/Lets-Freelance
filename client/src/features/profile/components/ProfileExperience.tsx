import SingleProfileExperience from "./SingleProfileExperience";

interface Props {
    experiences: {
        title: string;
        company: string;
        startDate: string;
        endDate: string;
        description: string;
    }[]
}


const ProfileExperience = (props: React.PropsWithoutRef<Props>) => {
    return (
        <div className="px-4">
            <section className="border-t py-4">
                <h2 className="font-medium text-2xl pt-3 pb-4">Work & Experience</h2>
                <ul className="flex flex-col gap-2">
                    {props.experiences.map((experience, index) => <SingleProfileExperience key={index} experience={experience} isLastExperience={props.experiences.length === index + 1} />)}
                </ul>
            </section>
        </div>
    )
}

export default ProfileExperience