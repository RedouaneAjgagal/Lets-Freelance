import { useState } from "react";
import Input from "../../../components/Input"
import SelectOptions from "../../../components/SelectOptions"

type JobFormDurationProps = {
    isError: boolean;
    defaultValue: {
        dateType: "hours" | "days" | "months";
        dateValue: number;
    };
}

const JobFormDuration = (props: React.PropsWithoutRef<JobFormDurationProps>) => {
    const [durationValue, setDurationValue] = useState(props.defaultValue.dateType);

    const selectOptions = [
        {
            name: "Hours",
            value: "hours"
        },
        {
            name: "Days",
            value: "days"
        },
        {
            name: "Months",
            value: "months"
        }
    ];

    const selectDurationTypeHandler = ({ value }: { name: string; value: string }) => {
        setDurationValue(value as "hours" | "days" | "months");
    }

    return (
        <div className="flex items-center gap-2">
            <Input errorMsg="" id={`job_duration_value`} name={`job_duration_value`} includeLabel labelContent="Job duration" isError={props.isError} type="number" defaultValue={props.defaultValue.dateValue === 0 ? "" : props.defaultValue.dateValue} />
            <div className="w-full max-w-[7rem] -mb-2">
                <SelectOptions options={selectOptions} selectTitle={durationValue} onSelect={selectDurationTypeHandler} isError={props.isError} />
                <input type="text" className="sr-only" hidden readOnly value={durationValue} name="job_duration_type" />
            </div>
        </div>
    )
}

export default JobFormDuration