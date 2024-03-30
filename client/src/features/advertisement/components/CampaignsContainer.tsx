import { Link } from "react-router-dom"
import { GetCampaignsResponse } from "../services/getCampaigns"
import formatDate from "../../../utils/formatDate";
import toUpperCase from "../../../utils/toUpperCase";

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
                    {props.campaigns.map((campaign, index) => {
                        const startingDate = formatDate(campaign.startDate);
                        const endingDate = formatDate(campaign.endDate);
                        return (
                            <tr key={campaign._id} className={`${campaign.status === "active" ? "text-black" : "text-slate-400"} ${index % 2 !== 0 ? "bg-slate-200/30" : "bg-slate-100"}`}>
                                <td className="border border-slate-300 px-2 py-3 w-80">
                                    <Link to={`/profile/freelancer/advertisements/campaigns/${campaign._id}`} className="font-medium text-lg text-stone-600 flex w-fit underline">{campaign.name}</Link>
                                </td>
                                <td className="border border-slate-300 p-2">{toUpperCase({ value: campaign.status })}</td>
                                <td className="border border-slate-300 p-2">${campaign.budget.toFixed(2)}</td>
                                <td className="border border-slate-300 p-2">{toUpperCase({ value: campaign.budgetType })}</td>
                                <td className="border border-slate-300 p-2">{campaign.clicks}</td>
                                <td className="border border-slate-300 p-2">{campaign.impressions}</td>
                                <td className="border border-slate-300 p-2">{campaign.orders}</td>
                                <td className="border border-slate-300 p-2">{campaign.ctr}</td>
                                <td className="border border-slate-300 p-2">{campaign.cr}</td>
                                <td className="border border-slate-300 p-2">{campaign.cpc}</td>
                                <td className="border border-slate-300 p-2">${campaign.spend.toFixed(2)}</td>
                                <td className="border border-slate-300 p-2">
                                    {`${campaign.activeAds} / ${campaign.totalAds}`}
                                </td>
                                <td className="border border-slate-300 p-2">{startingDate}</td>
                                <td className="border border-slate-300 p-2">{endingDate}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default CampaignsContainer