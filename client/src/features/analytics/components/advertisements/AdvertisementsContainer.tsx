import { useState } from "react"
import CampaignAnalyticsContainer from "./CampaignAnalyticsContainer";
import AdSetsAnalyticsContainer from "./AdSetsAnalyticsContainer";


const AdvertisementsContainer = () => {
    const [tab, setTab] = useState<"campaign" | "ad">("campaign");

    const tabs = ["campaign", "ad"] as const;

    const CurrentOpenTab = tab === "campaign"
        ? CampaignAnalyticsContainer
        : AdSetsAnalyticsContainer;

    return (
        <div>
            <ul className="flex items-center gap-2 mt-6">
                {tabs.map(tabValue => (
                    <li key={tabValue}>
                        <button onClick={() => setTab(tabValue)} className={`capitalize min-w-[6rem] border-b-2 ${tabValue === tab
                            ? "font-medium border-slate-800"
                            : " border-b-transparent"}`}>{tabValue}</button>
                    </li>
                ))}
            </ul>
            <CurrentOpenTab />
        </div>
    )
}

export default AdvertisementsContainer