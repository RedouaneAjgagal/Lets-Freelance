import { useState } from "react"


const ProposalFormCoverLetter = () => {
    const [coverLetterLength, setCoverLetterLength] = useState(0);

    const MAX_LENGTH = 3000;

    const setCoverLetterLengthHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCoverLetterLength(e.currentTarget.value.length);
    }

    return (
        <div className="flex flex-col gap-2">
            <label className="text-lg font-medium" htmlFor="submitProposal_coverLetter">Cover letter</label>
            <div className="flex flex-col gap-1">
                <textarea onChange={setCoverLetterLengthHandler} name="submitProposal_coverLetter" id="submitProposal_coverLetter" className="border-2 border-slate-300 text-slate-600 rounded py-2 px-3 outline-none focus:border-slate-500 w-full resize-none min-h-[10rem]" autoComplete="false" maxLength={MAX_LENGTH}></textarea>
                <small className="self-end text-slate-500 font-medium">{`${coverLetterLength} / ${MAX_LENGTH}`}</small>
            </div>
        </div>
    )
}

export default ProposalFormCoverLetter