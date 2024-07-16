import { TbHeart, TbLoader2 } from "react-icons/tb";
import { PrimaryButton } from "../../../layouts/brand";
import { useNavigate } from "react-router-dom";
import { useFavoritesMutation } from "../../favorites";

type ApplyJobContainerProps = {
    connects: number;
    jobId: string;
    hasSubmitted: boolean;
    isFavorited: boolean;
}

const ApplyJobContainer = (props: React.PropsWithoutRef<ApplyJobContainerProps>) => {
    const favoriteMutation = useFavoritesMutation({
        event: "job",
        target: props.jobId
    });

    const navigate = useNavigate();

    const connectPluralize = props.connects === 1 ? "" : "s";

    const alreadySubmittedContent = `Already submitted`;
    const applyJobContent = `Apply (${props.connects} connect${connectPluralize})`;

    const applyJobHandler = () => {
        if (props.hasSubmitted) return;
        navigate(`/proposals/job/${props.jobId}/submit`);
    }

    const favoriteJobToggle = () => {
        if (favoriteMutation.isLoading) return;
        favoriteMutation.mutate({
            event: "job",
            target: props.jobId
        });
    }

    return (
        <>
            <PrimaryButton disabled={props.hasSubmitted} fullWith={true} justifyConent="center" style="solid" type="button" x="lg" y="lg" isLoading={false} onClick={applyJobHandler} inactive={props.hasSubmitted}>
                {props.hasSubmitted ?
                    alreadySubmittedContent
                    : applyJobContent
                }
            </PrimaryButton>
            <button onClick={favoriteJobToggle} disabled={favoriteMutation.isLoading} className={`${props.isFavorited ? "text-white border-white bg-purple-600" : "text-slate-700 border-slate-300"} border p-3 rounded-full flex items-center justify-center`}>
                {favoriteMutation.isLoading ?
                    <TbLoader2 className="animate-spin" size={20} />
                    : <TbHeart size={20} />
                }
            </button>
        </>
    )
}

export default ApplyJobContainer