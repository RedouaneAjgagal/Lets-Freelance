import formatDate from "../../../utils/formatDate";

interface Props {
    jobDetail: {
        title: string;
        startDate: string;
    };
    isLastJob: boolean;
}

const InProgressJob = (props: React.PropsWithoutRef<Props>) => {

    const startDate = formatDate(props.jobDetail.startDate);
    const date = `${startDate} - Present`;

    return (
        <>
            <li className="pb-5 border-b last:pb-0 last:border-b-0">
                <h4 className="text-lg font-medium">{props.jobDetail.title}</h4>
                <div className="flex items-center flex-wrap gap-x-1">
                    <small className="text-slate-500">
                        {date}
                    </small>
                </div>
                <p className="mt-4 text-slate-600 text-[.95rem]">Job in progress</p>
            </li>
        </>
    )
}

export default InProgressJob