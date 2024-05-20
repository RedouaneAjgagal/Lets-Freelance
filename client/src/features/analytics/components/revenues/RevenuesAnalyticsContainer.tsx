import { useState } from "react";
import ServiceRevenueAnalyticsContainer from "./ServiceRevenueAnalyticsContainer";


const RevenuesAnalyticsContainer = () => {
    const [tab, setTab] = useState<"services" | "hourly jobs" | "fixed jobs" | "connects" | "advertisements">("services");

    const tabs = ["services", "hourly jobs", "fixed jobs", "connects", "advertisements"] as const;

    const revenuesAnalytics = {
        services: ServiceRevenueAnalyticsContainer
    };

    const CurrentOpenTabRevenueAnalytics = revenuesAnalytics["services"];

    return (
        <div>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6">
                {tabs.map(tabValue => (
                    <li key={tabValue}>
                        <button onClick={() => setTab(tabValue)} className={`capitalize text-left font-medium border-b-2 ${tabValue === tab
                            ? "border-slate-800"
                            : " text-slate-500 border-b-transparent"}`}>{tabValue}</button>
                    </li>
                ))}
            </ul>
            <CurrentOpenTabRevenueAnalytics />
        </div>
    )
}

export default RevenuesAnalyticsContainer