import { useState } from "react";
import DescriptionModal from "../modals/DescriptionModal";
import { JobContractType } from "../services/getUserSingleContract"
import useOverflow from "../../../hooks/useOverflow";
import toUpperCase from "../../../utils/toUpperCase";
import { Link } from "react-router-dom";


type ContractJobInfoProps = {
    job: JobContractType["job"];
}

const ContractJobInfo = (props: React.PropsWithoutRef<ContractJobInfoProps>) => {
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [isCoverLetter, setIsCoverLetter] = useState(false);


    const estimatedPluralize = props.job.estimatedTime.timeValue === 1 ? "" : "s";

    useOverflow(isDescriptionOpen);
    useOverflow(isCoverLetter);

    return (
        <div className="flex flex-col gap-2">
            <div>
                <Link to={`/jobs/${props.job.jobInfo}`} className="underline text-sm text-slate-600">Job</Link>
                <h3 className="text-lg font-medium leading-5">Contract title: <span className="text-base text-slate-700">"{props.job.title}"</span>
                </h3>
            </div>
            <div className="flex gap-1 flex-wrap">
                <h3 className="text-lg font-medium leading-5">Description:</h3>
                <button onClick={() => setIsDescriptionOpen(true)} className="underline">View</button>
                {isDescriptionOpen ?
                    <DescriptionModal onClose={() => setIsDescriptionOpen(false)} description={props.job.description} />
                    : null
                }
            </div>
            <div className="flex gap-1 flex-wrap">
                <h3 className="text-lg font-medium leading-5">{toUpperCase({ value: props.job.priceType })} price: </h3>
                <em>${props.job.price.toFixed(2)}</em>
            </div>
            <div className="flex gap-1 flex-wrap">
                <h3 className="text-lg font-medium leading-5">Cover letter:</h3>
                <button onClick={() => setIsCoverLetter(true)} className="underline">View</button>
                {isCoverLetter ?
                    <DescriptionModal title="Cover letter:" onClose={() => setIsCoverLetter(false)} description={props.job.coverLetter} />
                    : null
                }
            </div>
            <div className="flex gap-1 flex-wrap">
                <h3 className="text-lg font-medium leading-5">Estimated duration:</h3>
                <p>{props.job.estimatedTime.timeValue} {props.job.estimatedTime.timeType.slice(0, -1)}{estimatedPluralize}</p>
            </div>
        </div>
    )
}

export default ContractJobInfo