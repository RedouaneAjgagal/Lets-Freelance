import { TbCategory } from "react-icons/tb";
import formatPostedTime from "../../../utils/formatPostedTime";
import { SingleJobType } from "../service/getSingleJob"
import toUpperCase from "../../../utils/toUpperCase";
import SaveActivity from "../../../components/SaveActivity";
import ReportActivity from "../../../components/ReportActivity";
import { useAppSelector } from "../../../hooks/redux";

type SingleJobHeaderProps = {
    status: SingleJobType["status"];
    title: SingleJobType["title"];
    createdAt: SingleJobType["createdAt"];
    category: SingleJobType["category"];
    jobId: string;
}

const SingleJobHeader = (props: React.PropsWithoutRef<SingleJobHeaderProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const { diff, pluralize, unit } = formatPostedTime({ postedAt: props.createdAt });
    const postedAt = `Posted ${diff} ${unit}${pluralize} ago`;

    const category = toUpperCase({
        value: props.category,
        everyWord: true
    });

    const status = toUpperCase({ value: props.status });

    return (
        <header className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className={`${props.status === "open" ? "bg-blue-300/30 text-blue-500" : "bg-stone-300/30 text-stone-500"} self-start py-1 px-3 rounded text-center font-medium`}>{status}</span>
                <div className="flex items-center gap-4">
                    <SaveActivity activity="job" />
                    {userInfo ?
                        <ReportActivity activity="job" target={props.jobId} />
                        : null
                    }
                </div>
            </div>
            <h1 className="text-2xl font-semibold">{props.title}</h1>
            <div className="flex flex-col gap-2">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <TbCategory size={20} />
                    {category}
                </span>
                <small className="text-slate-600">{postedAt}</small>
            </div>
        </header>
    )
}

export default SingleJobHeader