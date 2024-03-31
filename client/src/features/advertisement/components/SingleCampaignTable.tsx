import { GetSingleCampaignResponse } from "../services/getSingleCampaign";
import AdSetRow from "./AdSetRow";


type SingleCampaignTableProps = {
    ads: GetSingleCampaignResponse["ads"];
    totalMetrics: {
        totalClicks: GetSingleCampaignResponse["totalClicks"];
        totalImpressions: GetSingleCampaignResponse["totalImpressions"];
        totalOrders: GetSingleCampaignResponse["totalOrders"];
        totalSpend: GetSingleCampaignResponse["totalSpend"];
        ctr: GetSingleCampaignResponse["ctr"];
        cr: GetSingleCampaignResponse["cr"];
        cpc: GetSingleCampaignResponse["cpc"];
    }
}

const SingleCampaignTable = (props: React.PropsWithoutRef<SingleCampaignTableProps>) => {
    const tableHeads = ["Ad ID", "Status", "Event", "Bid amount", "Ctr", "Cr", "Cpc", "Impressions", "Clicks", "Orders", "Spend", "Actions"];

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
                    {props.ads.map((adSet, index) => <AdSetRow key={adSet.ad} ad={adSet} index={index} />)}
                </tbody>
                <tfoot className="font-medium">
                    <tr>
                        <th colSpan={4} className="text-left border border-slate-400 px-2 py-5 bg-slate-300">Total Metrics</th>
                        <td className="border border-slate-400 p-2 capitalize bg-slate-300">{props.totalMetrics.ctr}%</td>
                        <td className="border border-slate-400 p-2 capitalize bg-slate-300">{props.totalMetrics.cr}%</td>
                        <td className="border border-slate-400 p-2 capitalize bg-slate-300">${props.totalMetrics.cpc.toFixed(2)}</td>
                        <td className="border border-slate-400 p-2 capitalize bg-slate-300">{props.totalMetrics.totalImpressions}</td>
                        <td className="border border-slate-400 p-2 capitalize bg-slate-300">{props.totalMetrics.totalClicks}</td>
                        <td className="border border-slate-400 p-2 capitalize bg-slate-300">{props.totalMetrics.totalOrders}</td>
                        <td colSpan={2} className="border border-slate-400 p-2 capitalize bg-slate-300">${props.totalMetrics.totalSpend.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default SingleCampaignTable