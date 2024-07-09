import { TbCategory, TbLocation, TbCalendar } from "react-icons/tb";
import { FreelancerProposalType } from "../service/getFreelancerProposals"
import Status from "../../../components/Status";
import ActionButton from "../../../layouts/brand/ActionButton";
import { useState } from "react";
import CoverLetterModal from "../modals/CoverLetterModal";
import useOverflow from "../../../hooks/useOverflow";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEnvelope } from "react-icons/fa";
import { LuFileSignature } from "react-icons/lu";

type FreelancerProposalsTableProps = {
    proposal: FreelancerProposalType;
};

const FreelancerProposalTable = (props: React.PropsWithoutRef<FreelancerProposalsTableProps>) => {
    const navigate = useNavigate();

    const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);

    const submittedAt = new Date(props.proposal.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    const closeModalHandler = () => {
        setIsCoverLetterOpen(false);
    }

    const viewProposalContentHandler = () => {
        setIsCoverLetterOpen(true);
    }

    const navigateToContractHandler = () => {
        if (!props.proposal.contract) return;

        navigate(`/profile/contracts/${props.proposal.contract._id}`);
    }

    useOverflow(isCoverLetterOpen);
    
    return (
        <tr className="border-t">
            <td className="p-2 py-4">
                <div className="flex flex-col gap-2">
                    <Link to={`/jobs/${props.proposal.job._id}`} className="font-medium text-[1.1rem] underline">
                        {props.proposal.job.title}
                    </Link>
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                        <TbCategory className="min-w-[1rem] text-base" />
                        {props.proposal.job.category}
                    </span>
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                        <TbLocation className="min-w-[1rem] text-base" />
                        {props.proposal.job.locationType}
                    </span>
                </div>
            </td>
            <td className="p-2 py-4">
                <div className="flex items-start gap-1 flex-wrap">
                    <span className="font-medium text-lg">{`$${props.proposal.price.toFixed(2)}`}</span>
                    <span className="text-slate-600 text-sm">{`${props.proposal.priceType === "hourly" ? "hr" : "fixed"}`}</span>
                </div>
            </td>
            <td className="p-2 py-4">
                {props.proposal.boostProposal.spentConnects ?
                    <div className="flex items-start gap-1">
                        <span className="font-medium text-lg">{props.proposal.boostProposal.spentConnects}</span>
                        <span className="text-slate-600 text-sm">connects</span>
                    </div>
                    : "--"}
            </td>
            <td className="p-2 py-4">
                <div className="flex items-center gap-2 text-slate-600">
                    <TbCalendar size={18} />
                    <span>{submittedAt}</span>
                </div>
            </td>
            <td className="p-2 py-4">
                <div className="flex">
                    <Status isLoading={false} type={props.proposal.status} />
                </div>
            </td>
            <td className="p-2 py-4">
                <div className="flex gap-2">
                    <ActionButton onClick={viewProposalContentHandler} type="customized" bgColor="bg-slate-500" icon={FaRegEnvelope} value="Cover letter" minimized={props.proposal.contract ? true : false} />
                    {props.proposal.contract ?
                        <ActionButton onClick={navigateToContractHandler} type="customized" bgColor="bg-stone-600" icon={LuFileSignature} value="Contract" />
                        : null
                    }
                    {
                        isCoverLetterOpen ?
                            <CoverLetterModal onClose={closeModalHandler} coverLetterContent={props.proposal.coverLetter} />
                            :
                            null
                    }
                </div>
            </td>
        </tr>
    )
}

export default FreelancerProposalTable