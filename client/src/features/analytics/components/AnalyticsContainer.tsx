import { useState } from "react";
import UsersAnalyticsContainer from "./users/UsersAnalyticsContainer";
import AnalyticsNavbar from "./AnalyticsNavbar";
import { AccessAnalyticsTypes, AnalyticsTypes } from "../utils/validAccessAnalytics";

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
        profiles: UsersAnalyticsContainer
    };

    const CurrentAnalytics = analyticsElements["profiles"];

    return (
        <div>
            <AnalyticsNavbar role={props.role} onSelect={navigateAnalyticsHandler} validAccessAnalytics={validAccessAnalytics} currentAnalytics={analyticsType} />
            <CurrentAnalytics />
        </div>
    )
}

export default AnalyticsContainer