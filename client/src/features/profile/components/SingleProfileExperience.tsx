import Timeline from "../../../components/Timeline"

interface Props {
    experience: {
        title: string;
        company: string;
        startDate: string;
        endDate: string;
        description: string;
    }
    isLastExperience: boolean;
}

const SingleProfileExperience = (props: React.PropsWithoutRef<Props>) => {
    const [startYear] = props.experience.startDate.split("/");
    const [endYear] = props.experience.endDate.split("/");
    const date = `${startYear} - ${endYear}`;
    return (
        <Timeline firstLetter={props.experience.title.slice(0, 1).toUpperCase()} isLastItem={props.isLastExperience}>
            <span className="flex items-center justify-center self-start rounded-full h-8 px-6 border border-purple-600">{date}</span>
            <div className="flex flex-col gap-1">
                <h3 className="font-medium text-lg">{props.experience.title}</h3>
                <span className="text-purple-500 font-medium">{props.experience.company}</span>
            </div>
            <p className="text-slate-600 pb-4">{props.experience.description}</p>
        </Timeline>
    )
}

export default SingleProfileExperience