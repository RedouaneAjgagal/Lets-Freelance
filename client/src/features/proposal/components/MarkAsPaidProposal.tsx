import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

type MarkAsPaidProposalProps = {
    status: "error" | "success";
    message: string;
    backTo: string;
}

const MarkAsPaidProposal = (props: React.PropsWithoutRef<MarkAsPaidProposalProps>) => {
    const navigate = useNavigate();

    const styles = {
        success: "text-green-700 bg-green-100",
        error: "text-red-700 bg-red-100"
    };

    const getStyle = styles[props.status];

    const backNavigator = () => {
        navigate(props.backTo);
    }

    return (
        <div className={`${getStyle} p-4 flex flex-col gap-2`}>
            <h2>{props.message}</h2>
            <div>
                <button onClick={backNavigator} className="text-slate-700 flex items-center gap-1 border-b-2 border-slate-500">
                    <BiArrowBack />
                    Back
                </button>
            </div>
        </div>
    )
}

export default MarkAsPaidProposal