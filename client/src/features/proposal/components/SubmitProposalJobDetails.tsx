import toUpperCase from "../../../utils/toUpperCase";
import { SingleJobType } from "../../job";
import formatDate from "../../../utils/formatDate";
import { Link } from "react-router-dom";

type SubmitProposalJobDetailsProps = {
    jobDetails: SingleJobType;
}

const SubmitProposalJobDetails = (props: React.PropsWithoutRef<SubmitProposalJobDetailsProps>) => {
    const category = toUpperCase({
        value: props.jobDetails.category,
        everyWord: true
    });

    const postedAt = formatDate(props.jobDetails.createdAt);

    return (
        <section className="border rounded bg-white shadow-sm">
            <h2 className="p-4 border-b text-2xl font-semibold text-slate-900">Job details</h2>
            <div className="px-3 py-4 flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-slate-800">{props.jobDetails.title}</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-slate-100 py-[.05rem] text-[.95rem] px-3 rounded-full border font-medium text-slate-600">
                            {category}
                        </span>
                        <small className="text-slate-600">{postedAt}</small>
                    </div>
                    <p className="line-clamp-3 text-slate-800">{props.jobDetails.description}</p>
                    <Link to={`/jobs/${props.jobDetails._id}`} className="underline text-purple-700">View Job posting</Link>
                </div>
            </div>
        </section>
    )
}

export default SubmitProposalJobDetails