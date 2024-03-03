import { TbHeart } from "react-icons/tb";
import { PrimaryButton } from "../../../layouts/brand";
import { useNavigate } from "react-router-dom";

type ApplyJobContainerProps = {
    connects: number;
    jobId: string;
}

const ApplyJobContainer = (props: React.PropsWithoutRef<ApplyJobContainerProps>) => {
    const navigate = useNavigate();

    const connectPluralize = props.connects === 1 ? "" : "s";
    const applyJobContent = `Apply (${props.connects} connect${connectPluralize})`;

    const applyJobHandler = () => {
        navigate(`/proposals/job/${props.jobId}/submit`);
    }

    return (
        <>
            <PrimaryButton disabled={false} fullWith={true} justifyConent="center" style="solid" type="button" x="lg" y="lg" isLoading={false} onClick={applyJobHandler}>{applyJobContent}</PrimaryButton>
            <button className="border text-slate-700 border-slate-300 p-3 rounded-full flex items-center justify-center"><TbHeart size={20} /></button>
        </>
    )
}

export default ApplyJobContainer