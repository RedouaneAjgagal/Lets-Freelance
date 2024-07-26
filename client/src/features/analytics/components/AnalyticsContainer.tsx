import { useState } from "react";
import UsersAnalyticsContainer from "./users/UsersAnalyticsContainer";
import AnalyticsNavbar from "./AnalyticsNavbar";
import ServicesAnalyticsContainer from "./services/ServicesAnalyticsContainer";
import JobsAnalyticsContainer from "./jobs/JobsAnalyticsContainer";
import ReportsAnalyticsContainer from "./reports/ReportsAnalyticsContainer";
import ProposalsAnalyticsContainer from "./proposals/ProposalsAnalyticsContainer";
import ContractsAnalyticsContainer from "./contracts/ContractsAnalyticsContainer";
import AdvertisementsContainer from "./advertisements/AdvertisementsContainer";
import RevenuesAnalyticsContainer from "./revenues/RevenuesAnalyticsContainer";

export type AnalyticsTypes = "profiles" | "services" | "jobs" | "reports" | "proposals" | "contracts" | "advertisements" | "revenues";

export type AnalyticsType = {
    _id: string;
    count: number;
}

export type AccessAnalyticsTypes = {
    value: AnalyticsTypes;
    accessBy: ("admin" | "owner")[];
};

type AnalyticsContainerProps = {
    role: "admin" | "owner";
}

const AnalyticsContainer = (props: React.PropsWithoutRef<AnalyticsContainerProps>) => {
    const [analyticsType, setAnalyticsType] = useState<AnalyticsTypes>(props.role === "admin" ? "profiles" : "revenues");

    const validAccessAnalytics: AccessAnalyticsTypes[] = [
        {
            value: "revenues",
            accessBy: ["owner"]
        },
        {
            value: "profiles",
            accessBy: ["admin", "owner"]
        },
        {
            value: "services",
            accessBy: ["admin", "owner"]
        },
        {
            value: "jobs",
            accessBy: ["admin", "owner"]
        },
        {
            value: "reports",
            accessBy: ["admin", "owner"]
        },
        {
            value: "proposals",
            accessBy: ["admin", "owner"]
        },
        {
            value: "contracts",
            accessBy: ["admin", "owner"]
        },
        {
            value: "advertisements",
            accessBy: ["admin", "owner"]
        }
    ];

    const navigateAnalyticsHandler = (value: AnalyticsTypes) => {
        const analytics = validAccessAnalytics.find(analytics => analytics.value === value);

        if (!analytics || !analytics.accessBy.includes(props.role)) return;

        setAnalyticsType(value);
    }


    const analyticsElements = {
        profiles: UsersAnalyticsContainer,
        services: ServicesAnalyticsContainer,
        jobs: JobsAnalyticsContainer,
        reports: ReportsAnalyticsContainer,
        proposals: ProposalsAnalyticsContainer,
        contracts: ContractsAnalyticsContainer,
        advertisements: AdvertisementsContainer,
        revenues: RevenuesAnalyticsContainer
    };

    const CurrentAnalytics = analyticsElements[analyticsType];

    return (
        <div>
            <AnalyticsNavbar role={props.role} onSelect={navigateAnalyticsHandler} validAccessAnalytics={validAccessAnalytics} currentAnalytics={analyticsType} />
            <CurrentAnalytics />
        </div>
    )
}

export default AnalyticsContainer