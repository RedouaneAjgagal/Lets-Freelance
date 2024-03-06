import { useState } from "react";
import { GetEmployerJobProposalType } from "../service/getEmployerJobProposals"
import CoverLetterModal from "../modals/CoverLetterModal";
import useOverflow from "../../../hooks/useOverflow";

type EmployerJobProposalCoverLetterProps = {
    coverLetter: GetEmployerJobProposalType["coverLetter"];
    MAX_LENGTH: number;
}

const EmployerJobProposalCoverLetter = (props: React.PropsWithoutRef<EmployerJobProposalCoverLetterProps>) => {
    const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);

    const isLongCoverLetter = props.coverLetter.length > props.MAX_LENGTH;

    const coverLetter = isLongCoverLetter ?
        `${props.coverLetter.slice(0, props.MAX_LENGTH)}... `
        : props.coverLetter;


    const openCoverLetterHandler = () => {
        setIsCoverLetterOpen(true);
    }

    const closeCoverLetterHandler = () => {
        setIsCoverLetterOpen(false);
    }

    useOverflow(isCoverLetterOpen);

    return (
        <>
            {isCoverLetterOpen ?
                <CoverLetterModal coverLetterContent={props.coverLetter} onClose={closeCoverLetterHandler} />
                : null
            }
            <div>
                <strong className="font-semibold">Cover letter</strong>
                <span> - </span>
                <p className="text-slate-600 inline">{coverLetter}</p>
                {isLongCoverLetter ?
                    <button onClick={openCoverLetterHandler} className="font-medium text-slate-800">Read more</button>
                    : null
                }
            </div>
        </>
    )
}

export default EmployerJobProposalCoverLetter