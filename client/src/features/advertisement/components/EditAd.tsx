import { AdType } from "../services/getSingleCampaign";
import useUpdateAdMutation from "../hooks/useUpdateAdMutation";
import { useParams } from "react-router-dom";
import SingleAd from "./SingleAd";

type EditAdProps = {
    onClose: () => void;
    ad: AdType;
    tableContainerRef: React.RefObject<HTMLDivElement>;
}

const EditAd = (props: React.PropsWithoutRef<EditAdProps>) => {
    const { campaignId } = useParams();

    const updateAdMutation = useUpdateAdMutation({
        campaignId: campaignId!,
        adId: props.ad.ad
    });

    return (
        <SingleAd type="update" ad={props.ad} onClose={props.onClose} submitAd={updateAdMutation} tableContainerRef={props.tableContainerRef} />
    )
}

export default EditAd