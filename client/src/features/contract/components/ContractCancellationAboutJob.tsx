import { useState } from "react";
import { ContractCancellationJobType } from "../services/getContractCancellations"

type ContractCancellationAboutJobProps = {
    jobContract: ContractCancellationJobType;
}

const ContractCancellationAboutJob = (props: React.PropsWithoutRef<ContractCancellationAboutJobProps>) => {
    const [isDisplayFullDescription, setIsDisplayFullDescription] = useState(false);

    const DESCRIPTION_SIZE = 96;
    const description = props.jobContract.description.slice(0, isDisplayFullDescription
        ? props.jobContract.description.length
        : DESCRIPTION_SIZE
    );

    const descriptionToggleHandler = () => {
        setIsDisplayFullDescription(prev => !prev);
    }

    const coverLetterContent = props.jobContract.coverLetter.replace(/\n/g, "<br>");

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
                <h5 className="font-medium">Job:</h5>
                <span className="text-slate-600">{props.jobContract.jobInfo}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Title:</h5>
                <span className="text-slate-600">{props.jobContract.title}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Description:</h5>
                <span className="text-slate-600">
                    {
                        `${description}${isDisplayFullDescription ? "" : "..."}`
                    } {
                        props.jobContract.description.length > DESCRIPTION_SIZE
                            ? <button onClick={descriptionToggleHandler} className="font-medium text-black">{isDisplayFullDescription ? "Show less" : "Show more"}</button>
                            : null
                    }
                </span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Estimated time:</h5>
                <span className="text-slate-600">{props.jobContract.estimatedTime.timeValue} {props.jobContract.estimatedTime.timeType}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Price:</h5>
                <span className="text-slate-600">${props.jobContract.price.toFixed(2)} {props.jobContract.priceType === "hourly" ? "/hr" : "fixed"}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Proposal:</h5>
                <span className="text-slate-600">{props.jobContract.proposal}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Cover letter:</h5>
                <div className="p-3 bg-slate-200/50 rounded">
                    <i className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: coverLetterContent }}></i>
                </div>
            </div>
        </div>
    )
}

export default ContractCancellationAboutJob