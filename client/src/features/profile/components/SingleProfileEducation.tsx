
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
        <li className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
                <span className="flex justify-center items-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-medium ">{props.educationInfo.title.slice(0, 1).toUpperCase()}</span>
                {!props.isLastEducation ? <div className="h-full border-l-2 border-dashed border-purple-600"></div> : null}
            </div>
            <div className="flex flex-col gap-4">
                <span className="flex items-center justify-center self-start rounded-full h-8 px-6 border border-purple-600">{props.educationInfo.year}</span>
                <div className="flex flex-col gap-1">
                    <h3 className="font-medium text-lg">{props.educationInfo.title}</h3>
                    <span className="text-purple-500 font-medium">{props.educationInfo.academy}</span>
                </div>
                <p className="text-slate-600 pb-4">{props.educationInfo.description}</p>
            </div>
        </li>
    )
}

export default SingleProfileEducation