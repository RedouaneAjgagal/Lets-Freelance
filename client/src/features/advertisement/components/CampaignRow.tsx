import { Link } from "react-router-dom";
import formatDate from "../../../utils/formatDate";
import { SingleCampaignType } from "../services/getCampaigns";
import Toggle from "./Toggle";
import { useState } from "react";
import useActivateCampaignMutation from "../hooks/useActivateCampaignMutation";

type CampaignRowProps = {
    campaign: SingleCampaignType;
    index: number;
}

const CampaignRow = (props: React.PropsWithoutRef<CampaignRowProps>) => {
    const [isActiveCampaign, setIsActiveCampaign] = useState(props.campaign.status === "active" ? true : false);

    const activateCampaignMutation = useActivateCampaignMutation({
        campaignId: props.campaign._id
    });


    const activeCampaignToggle = () => {
        setIsActiveCampaign(prev => !prev);
    }

    const activateCampaignToggle = () => {
        const status = isActiveCampaign ? "inactive" : "active";

        if (activateCampaignMutation.isLoading) return;

        activateCampaignMutation.mutate({
            campaignId: props.campaign._id,
            status
        });

        activeCampaignToggle();
    }


    const startingDate = formatDate(props.campaign.startDate);
    const endingDate = formatDate(props.campaign.endDate);

    return (
        <tr key={props.campaign._id} className={`${props.campaign.status === "active" ? "text-black" : "text-slate-400"} ${props.index % 2 !== 0 ? "bg-slate-200/30" : "bg-slate-100"}`}>
            <td className="border border-slate-300 px-2 py-3 w-80 flex items-center gap-4">
                <Toggle id={`activate_campaign_${props.campaign._id}`} isChecked={isActiveCampaign} onChange={activateCampaignToggle} isLoading={activateCampaignMutation.isLoading} />
                <Link to={`/profile/freelancer/advertisements/campaigns/${props.campaign._id}`} className="font-medium text-lg text-stone-600 flex w-fit underline">{props.campaign.name}</Link>
            </td>
            <td className="border border-slate-300 p-2 capitalize">{props.campaign.status}</td>
            <td className="border border-slate-300 p-2">${props.campaign.budget.toFixed(2)}</td>
            <td className="border border-slate-300 p-2 capitalize">{props.campaign.budgetType}</td>
            <td className="border border-slate-300 p-2">{props.campaign.clicks}</td>
            <td className="border border-slate-300 p-2">{props.campaign.impressions}</td>
            <td className="border border-slate-300 p-2">{props.campaign.orders}</td>
            <td className="border border-slate-300 p-2">{props.campaign.ctr}</td>
            <td className="border border-slate-300 p-2">{props.campaign.cr}</td>
            <td className="border border-slate-300 p-2">{props.campaign.cpc}</td>
            <td className="border border-slate-300 p-2">${props.campaign.spend.toFixed(2)}</td>
            <td className="border border-slate-300 p-2">
                {`${props.campaign.activeAds} / ${props.campaign.totalAds}`}
            </td>
            <td className="border border-slate-300 p-2">{startingDate}</td>
            <td className="border border-slate-300 p-2">{endingDate}</td>
        </tr>
    )

}

export default CampaignRow