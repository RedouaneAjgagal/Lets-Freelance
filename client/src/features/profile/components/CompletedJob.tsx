import formatDate from "../../../utils/formatDate";
import Ratings from "./Ratings";

interface Props {
    jobDetail: {
        title: string;
        rating: number;
        startDate: string;
        endDate: string;
        content: string;
    };
}

const CompletedJob = (props: React.PropsWithoutRef<Props>) => {

    const startDate = formatDate(props.jobDetail.startDate);
    const endDate = formatDate(props.jobDetail.endDate);
    const date = `${startDate} - ${endDate}`;

    const content = `"${props.jobDetail.content}"`;

    return (
        <>
            <li className="pb-5 border-b last:pb-0 last:border-b-0">
                <h4 className="text-lg font-medium">{props.jobDetail.title}</h4>
                <div className="flex items-center flex-wrap gap-x-1">
                    <Ratings maxStars={5} rate={props.jobDetail.rating} />
                    <strong className="flex font-medium">
                        {props.jobDetail.rating.toFixed(2)}
                    </strong>
                    <small className="text-slate-500">
                        {date}
                    </small>
                </div>
                <p className="mt-4 text-slate-600 text-[.95rem]">
                    <em>{content}</em>
                </p>
            </li>
        </>
    )
}

export default CompletedJob