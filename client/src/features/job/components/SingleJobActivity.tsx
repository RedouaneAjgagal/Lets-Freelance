import { SingleJobType } from "../service/getSingleJob"

type SingleJobActivityProps = {
    jobActivity: SingleJobType["activity"];
}

const SingleJobActivity = (props: React.PropsWithoutRef<SingleJobActivityProps>) => {

    const totalProposalValidValues: { proposal: string; value: { min: number; max?: number } }[] = [
        {
            proposal: "Be the first to submit",
            value: {
                min: 0,
                max: 1
            }
        },
        {
            proposal: "Less than 5",
            value: {
                min: 1,
                max: 5
            }
        },
        {
            proposal: "5 to 20",
            value: {
                min: 5,
                max: 20
            }
        },
        {
            proposal: "20 to 50",
            value: {
                min: 20,
                max: 50
            }
        },
        {
            proposal: "50+",
            value: {
                min: 50,
                max: 200
            }
        }
    ];

    const [getProposals] = totalProposalValidValues.filter(({ value }) => {
        if (props.jobActivity.totalProposals >= value.min && props.jobActivity.totalProposals < (value.max || props.jobActivity.totalProposals + 1)) {
            return true;
        }
    });

    return (
        <section className="flex flex-col gap-2">
            <h3 className="text-xl font-medium text-slate-800">Activity on this job</h3>
            <ul className="flex flex-col gap-1">
                <li className="flex items-center gap-2">
                    <span className="font-medium text-slate-600">Proposals:</span>
                    <span>{getProposals.proposal}</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="font-medium text-slate-600">Interviewing:</span>
                    <span>{props.jobActivity.interviewing}</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="font-medium text-slate-600">Approved:</span>
                    <span>{props.jobActivity.approved}</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="font-medium text-slate-600">Rejected:</span>
                    <span>{props.jobActivity.rejected}</span>
                </li>
            </ul>
        </section>
    )
}

export default SingleJobActivity