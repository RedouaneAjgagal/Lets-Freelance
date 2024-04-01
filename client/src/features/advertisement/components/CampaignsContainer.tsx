import { GetCampaignsResponse } from "../services/getCampaigns"
import CampaignRow from "./CampaignRow";

type CampaignsContainerProps = {
    campaigns: GetCampaignsResponse;
}

const CampaignsContainer = (props: React.PropsWithoutRef<CampaignsContainerProps>) => {

    const tableHeads = ["Campaign name", "Status", "Budget", "Budget type", "Clicks", "Impressions", "Orders", "Ctr", "Cr", "Cpc", "Spend", "Active ads", "Starting date", "Ending date"];

    return (
        <div className="overflow-x-scroll">
            <table className="border-separate border border-slate-500">
                <thead>
                    <tr className="text-left">
                        {tableHeads.map((tableHead, index) => (
                            <th key={index} className="border border-slate-400 px-2 py-5 bg-slate-300 first:min-w-[18rem] min-w-[10rem]">{tableHead}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-left">
                    {props.campaigns.map((campaign, index) => <CampaignRow key={campaign._id} campaign={campaign} index={index} />)}
                </tbody>
            </table>
        </div>
    )
}

export default CampaignsContainer