import { useState } from 'react'
import ReactQuill from 'react-quill'

type JobFormDescriptionProps = {
    isError: boolean;
    defaultValue: string;
}

const JobFormDescription = (props: React.PropsWithoutRef<JobFormDescriptionProps>) => {
    // Quill.
    const [descriptionValue, setDescriptionValue] = useState({ value: props.defaultValue, plainValue: props.defaultValue });

    return (
        <div className="relative pb-6 flex flex-col gap-1">
            <span className="text-lg font-medium">Job Description</span>
            <ReactQuill defaultValue={props.defaultValue} onChange={(value, _, __, editor) => setDescriptionValue({ value, plainValue: editor.getText() })} id="description" theme="snow" className={`bg-white [&>.ql-container>.ql-editor]:min-h-[9rem] [&>.ql-container]:border-2 [&>.ql-container]:border-t [&>.ql-container]:rounded-b [&>.ql-toolbar]:border-2 [&>.ql-toolbar]:border-b [&>.ql-toolbar]:rounded-t ${props.isError ? "[&>.ql-container]:border-red-300 [&>.ql-toolbar]:border-red-300" : "[&>.ql-container]:border-slate-300 [&>.ql-toolbar]:border-slate-300"}`} modules={{
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' },]
                ]
            }} />
            <input type="text" name="job_description" id="job_description" value={descriptionValue.value} readOnly className="sr-only" hidden />
            <input type="text" name="job_plainDescription" id="job_plainDescription" value={descriptionValue.plainValue} readOnly className="sr-only" hidden />
        </div>
    )
}

export default JobFormDescription