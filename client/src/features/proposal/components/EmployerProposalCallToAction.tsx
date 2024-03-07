import { IconType } from "react-icons";
import { TbCircleCheck, TbClock, TbXboxX } from "react-icons/tb";

type EmployerProposalCallToActionProps = {
    status: "pending" | "interviewing";
    onCLose: () => void;
    isLoading: boolean;
    onSubmit: (status: "interviewing" | "approved" | "rejected") => void;
}

type CallToActionType = {
    value: string;
    style: {
        text: string;
        backGround: string;
    }
    icon: IconType;
}

const EmployerProposalCallToAction = (props: React.PropsWithoutRef<EmployerProposalCallToActionProps>) => {
    const callToActions: {
        approved: CallToActionType;
        rejected: CallToActionType;
        interviewing?: CallToActionType;
    } = {
        approved: {
            value: "Hire",
            icon: TbCircleCheck,
            style: {
                text: "text-green-600",
                backGround: "bg-green-300/30"
            }
        },
        rejected: {
            value: "Reject",
            icon: TbXboxX,
            style: {
                text: "text-red-600",
                backGround: "bg-red-300/30"
            }
        }
    };

    if (props.status === "pending") {
        callToActions.interviewing = {
            value: "Interview",
            icon: TbClock,
            style: {
                text: "text-blue-600",
                backGround: "bg-blue-300/30"
            }
        }
    }

    const callToActionButtonList = Object.entries(callToActions).map(([key, status]) => {
        const proposalActionHandler = () => {
            if (props.isLoading) return;
            props.onSubmit(key as "interviewing" | "approved" | "rejected");
            props.onCLose();
        };

        return (
            <button disabled={props.isLoading} className={`tracking-wide py-2 px-4 flex items-center gap-2 border-b last:border-b-0`} key={key} onClick={proposalActionHandler}>
                <span className={`${status.style.text}`}>
                    <status.icon size={24} />
                </span>
                {status.value}
            </button>
        )
    });

    return (
        <div className="font-medium border absolute left-7 bottom-0 bg-white w-[12rem] flex flex-col shadow-md">
            {callToActionButtonList}
        </div>
    )
}

export default EmployerProposalCallToAction