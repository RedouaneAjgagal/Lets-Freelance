import { useState } from 'react'

type JobFormDescriptionProps = {
    isError: boolean;
    defaultValue: string;
}

const JobFormDescription = (props: React.PropsWithoutRef<JobFormDescriptionProps>) => {
    const [descriptionValue, setDescriptionValue] = useState(props.defaultValue);

    const setDescriptionHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const description = e.target.value;
        setDescriptionValue(description);
    }

    return (
        <div className="relative pb-6 flex flex-col gap-1">
            <label htmlFor="job_description" className="text-lg font-medium cursor-default">Job Description</label>
            <textarea onChange={setDescriptionHandler} name="job_description" id="job_description" value={descriptionValue} className={`border-2 text-slate-600 rounded py-2 px-3 outline-none focus:border-slate-400 w-full resize-none min-h-[14rem] ${props.isError ? "border-red-300" : "border-slate-300"}`}></textarea>
        </div>
    )
}

export default JobFormDescription