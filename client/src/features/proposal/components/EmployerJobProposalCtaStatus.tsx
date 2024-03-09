import { TbDotsVertical, TbX } from "react-icons/tb";
import { GetEmployerJobProposalType } from "../service/getEmployerJobProposals"
import Status from "../../../components/Status";
import { useState } from "react";
import EmployerProposalCallToAction from "./EmployerProposalCallToAction";
import useProposalActionMutation from "../hooks/useProposalActionMutation";
import { Link } from "react-router-dom";


type EmployerJobProposalCtaStatusProps = {
    status: GetEmployerJobProposalType["status"];
    proposalId: GetEmployerJobProposalType["_id"];
    contractId: string | undefined;
}

const EmployerJobProposalCtaStatus = (props: React.PropsWithoutRef<EmployerJobProposalCtaStatusProps>) => {
    const proposalActionMutation = useProposalActionMutation();

    const [isCallToActionOpen, setIsCallToActionOpen] = useState(false);

    const ctaToggleHandler = () => {
        setIsCallToActionOpen(prev => !prev);
    };

    const submitStatusHandler = (status: "interviewing" | "approved" | "rejected") => {
        proposalActionMutation.mutate({
            proposalId: props.proposalId,
            status
        });
    }

    return (
        <div className="flex">
            {(props.status === "interviewing" || props.status === "pending") ?
                <div className="flex relative z-10">
                    <button className="px-1" onClick={ctaToggleHandler}>
                        {isCallToActionOpen ?
                            <TbX size={20} />
                            : <TbDotsVertical size={20} />
                        }
                    </button>
                    {isCallToActionOpen ?
                        <EmployerProposalCallToAction status={props.status} onCLose={() => setIsCallToActionOpen(false)} isLoading={proposalActionMutation.isLoading} onSubmit={submitStatusHandler} />
                        : null
                    }
                </div>
                : null
            }
            <div className="w-full max-w-[8rem]">
                <Status type={props.status} isLoading={proposalActionMutation.isLoading} />
            </div>
            {props.contractId ?
                <div className="flex items-center ml-2">
                    <Link to={`/profile/contracts/${props.contractId}`} className="text-sm underline">View contract</Link>
                </div>
                : null
            }
        </div>
    )
}

export default EmployerJobProposalCtaStatus