import { useState } from "react";
import SelectOptions from "../../../components/SelectOptions";
import { SingleJobType } from "../../job";
import Input from "../../../components/Input";


type ProposalFormEstimatedDurationProps = {
    duration: SingleJobType["duration"];
}



const ProposalFormEstimatedDuration = (props: React.PropsWithoutRef<ProposalFormEstimatedDurationProps>) => {
    const [durationType, setDurationType] = useState(props.duration.dateType);

    const pluralizeDuration = props.duration.dateValue === 1 ? "" : "s";
    const suggestByJobPostDuration = `${props.duration.dateValue} ${props.duration.dateType.slice(0, -1)}${pluralizeDuration} is the suggested estimated duration by the job post`;


    const estimatedDurationOptions: { name: string; value: string }[] = [
        {
            name: "Hours",
            value: 'hours'
        },
        {
            name: "Days",
            value: 'days'
        },
        {
            name: "Months",
            value: 'months'
        }
    ];

    const selectEstimatedDurationHandler = ({ value }: { name: string; value: string }) => {
        setDurationType(value as SingleJobType["duration"]["dateType"]);
    }

    return (
        <div className="flex flex-col gap-2">
            <label className="text-lg font-medium" htmlFor="submitProposal_estimatedTime">Estimated duration</label>
            <div className="p-3 rounded bg-slate-100 grid grid-cols-9 items-center gap-3 text-slate-600 w-full">
                <span className="text-[.95rem] col-span-5">{suggestByJobPostDuration}</span>
                <div className="col-span-4 flex flex-col gap-2">
                    <SelectOptions options={estimatedDurationOptions} selectTitle={durationType} isError={false} onSelect={selectEstimatedDurationHandler} withoutDash />
                    <input type="text" name="submitProposal_durationType" id="submitProposal_durationType" hidden className="sr-only" readOnly value={durationType} />
                    <Input placeHolder="Duration" errorMsg="" id="submitProposal_estimatedTime" isError={false} includeLabel={false} name="submitProposal_estimatedTime" type="number" />
                </div>
            </div>
        </div>
    )
}

export default ProposalFormEstimatedDuration