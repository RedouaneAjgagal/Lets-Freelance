import { TbDotsVertical, TbX } from "react-icons/tb";
import { GetEmployerJobProposalType } from "../service/getEmployerJobProposals"
import Status from "../../../components/Status";
import { useState } from "react";
import EmployerProposalCallToAction from "./EmployerProposalCallToAction";


type EmployerJobProposalCtaStatusProps = {
    status: GetEmployerJobProposalType["status"];
}

const EmployerJobProposalCtaStatus = (props: React.PropsWithoutRef<EmployerJobProposalCtaStatusProps>) => {
    const [isCallToActionOpen, setIsCallToActionOpen] = useState(false);

    const ctaToggleHandler = () => {
        setIsCallToActionOpen(prev => !prev);
    };

    return (
        <div className="flex">
            {(props.status === "interviewing" || props.status === "pending") ?
                <div className="flex relative">
                    <button className="px-1" onClick={ctaToggleHandler}>
                        {isCallToActionOpen ?
                            <TbX size={20} />
                            : <TbDotsVertical size={20} />
                        }
                    </button>
                    {isCallToActionOpen ?
                        <EmployerProposalCallToAction status={props.status} onCLose={() => setIsCallToActionOpen(false)} />
                        : null
                    }
                </div>
                : null
            }
            <div className="w-full max-w-[8rem]">
                <Status type={props.status} />
            </div>
        </div>
    )
}

export default EmployerJobProposalCtaStatus