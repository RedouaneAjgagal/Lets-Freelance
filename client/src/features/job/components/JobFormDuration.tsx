import { useState } from "react";
import Input from "../../../components/Input"
import SelectOptions from "../../../components/SelectOptions"


const JobFormDuration = () => {
    const [durationValue, setDurationValue] = useState("days");

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
        setDurationValue(value);
    }

    return (
        <div className="flex items-center gap-2">
            <Input errorMsg="" id={`job_duration_value`} name={`job_duration_value`} includeLabel labelContent="Job duration" isError={false} type="number" />
            <div className="w-full max-w-[7rem] -mb-2">
                <SelectOptions options={selectOptions} selectTitle={durationValue} onSelect={selectDurationTypeHandler} />
                <input type="text" className="sr-only" hidden readOnly value={durationValue} name="job_duration_type" />
            </div>
        </div>
    )
}

export default JobFormDuration