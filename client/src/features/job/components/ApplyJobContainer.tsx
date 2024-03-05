import { TbHeart } from "react-icons/tb";
import { PrimaryButton } from "../../../layouts/brand";
import { Link, useNavigate } from "react-router-dom";

type ApplyJobContainerProps = {
    connects: number;
    jobId: string;
    hasSubmitted: boolean;
}

const ApplyJobContainer = (props: React.PropsWithoutRef<ApplyJobContainerProps>) => {
    const navigate = useNavigate();

    const connectPluralize = props.connects === 1 ? "" : "s";

    const alreadySubmittedContent = `Already submitted`;
    const applyJobContent = `Apply (${props.connects} connect${connectPluralize})`;

    const applyJobHandler = () => {
        if (props.hasSubmitted) return;
        navigate(`/proposals/job/${props.jobId}/submit`);
    }

    return (
        <>
            {props.hasSubmitted ?
                <Link className="w-full text-center bg-slate-200/60 font-medium p-2 rounded border-2 text-slate-600" to={`/profile/freelancer/proposals`}>{alreadySubmittedContent}</Link>
                : <PrimaryButton disabled={false} fullWith={true} justifyConent="center" style="solid" type="button" x="lg" y="lg" isLoading={false} onClick={applyJobHandler}>{applyJobContent}</PrimaryButton>
            }
            <button className="border text-slate-700 border-slate-300 p-3 rounded-full flex items-center justify-center"><TbHeart size={20} /></button>
        </>
    )
}

export default ApplyJobContainer