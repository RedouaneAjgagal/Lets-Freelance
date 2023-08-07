import Timeline from "../../../components/Timeline";

interface Props {
    educationInfo: {
        title: string;
        academy: string;
        year: string;
        description: string;
    }
    isLastEducation: boolean;
}

const SingleProfileEducation = (props: React.PropsWithoutRef<Props>) => {
    return (
        <Timeline isLastItem={props.isLastEducation} firstLetter={props.educationInfo.title.slice(0, 1).toUpperCase()}>
            <span className="flex items-center justify-center self-start rounded-full h-8 px-6 border border-purple-600">{props.educationInfo.year}</span>
            <div className="flex flex-col gap-1">
                <h3 className="font-medium text-lg">{props.educationInfo.title}</h3>
                <span className="text-purple-500 font-medium">{props.educationInfo.academy}</span>
            </div>
            <p className="text-slate-600 pb-4">{props.educationInfo.description}</p>
        </Timeline>
    )
}

export default SingleProfileEducation