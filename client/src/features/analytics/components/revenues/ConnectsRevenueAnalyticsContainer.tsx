import { useQueryClient } from "@tanstack/react-query";
import useConnectsRevenueAnalyticsQuery from "../../hooks/useConnectsRevenueAnalyticsQuery"
import { useState } from "react";
import ChartsNavbar, { FilterValues } from "../ChartsNavbar";
import { ConnectsRevenueAnalyticsPayload } from "../../services/connectsRevenueAnalytics";
import ConnectsRevenueAnalytics from "./ConnectsRevenueAnalytics";


const ConnectsRevenueAnalyticsContainer = () => {
    const queryClient = useQueryClient();
    const [filterBy, setFilterBy] = useState<FilterValues>("week");

    const connectsRevenuesPayload: ConnectsRevenueAnalyticsPayload = {};

    if (filterBy !== "all") {
        connectsRevenuesPayload.payment_duration = filterBy;
    };

    const connectsRevenueAnalyticsQuery = useConnectsRevenueAnalyticsQuery(connectsRevenuesPayload);

    const selectFilterHandler = (filterValue: FilterValues) => {
        setFilterBy(filterValue);

        queryClient.removeQueries({ queryKey: ["connectsRevenueAnalytics"] });
    };

    const durationNames = {
        day: "today",
        week: "last 7 days",
        month: "this month",
        year: "this year",
        all: ""
    };

    const formatedTitle = durationNames[filterBy];

    return (
        <div>
            <div className="mt-4">
                <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Connects revenue overview" />
            </div>
            <ConnectsRevenueAnalytics isLoading={connectsRevenueAnalyticsQuery.isLoading} payments={connectsRevenueAnalyticsQuery.data} title={`Processed payments ${formatedTitle}`} filterBy={filterBy} />
        </div>
    )
}

export default ConnectsRevenueAnalyticsContainer