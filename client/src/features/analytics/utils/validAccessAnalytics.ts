export type AnalyticsTypes = "profiles" | "services" | "jobs" | "reports" | "proposals" | "contracts" | "advertisements" | "revenues";

export type AccessAnalyticsTypes = {
    value: AnalyticsTypes;
    accessBy: ("admin" | "owner")[];
};

const validAccessAnalytics = () => {
    const validAccessAnalytics: AccessAnalyticsTypes[] = [
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
        },
        {
            value: "revenues",
            accessBy: ["owner"]
        }
    ];
}