import { useQueryClient } from "@tanstack/react-query";
import useAdvertisementRevenueAnalyticsQuery from "../../hooks/useAdvertisementRevenueAnalyticsQuery"
import { useState } from "react";
import ChartsNavbar, { FilterValues } from "../ChartsNavbar";
import { AdvertisementRevenueAnalyticsPaylod } from "../../services/advertisementRevenueAnalytics";
import AdvertisementRevenueAnalytics from "./AdvertisementRevenueAnalytics";


const AdvertisementRevenueAnalyticsContainer = () => {
    const queryClient = useQueryClient();
    const [filterBy, setFilterBy] = useState<FilterValues>("week");

    const advertisementRevenuePayload: AdvertisementRevenueAnalyticsPaylod = {};

    if (filterBy !== "all") {
        advertisementRevenuePayload.payment_duration = filterBy;
    };

    const advertisementRevenueAnalyticsQuery = useAdvertisementRevenueAnalyticsQuery(advertisementRevenuePayload);

    const selectFilterHandler = (filterValue: FilterValues) => {
        setFilterBy(filterValue);

        queryClient.removeQueries({ queryKey: ["advertisementRevenueAnalytics"] });
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
                <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Advertisements revenue overview" />
            </div>
            <AdvertisementRevenueAnalytics barDataKey="Paid amount" filterBy={filterBy} isLoading={advertisementRevenueAnalyticsQuery.isLoading} payments={advertisementRevenueAnalyticsQuery.data?.paidAmount} title={`Paid amount ${formatedTitle}`} />
            <AdvertisementRevenueAnalytics barDataKey="Pending amount" filterBy={filterBy} isLoading={advertisementRevenueAnalyticsQuery.isLoading} payments={advertisementRevenueAnalyticsQuery.data?.unpaidAmount} title={`Pending amount ${formatedTitle}`} />
            <AdvertisementRevenueAnalytics barDataKey="Failed amount" filterBy={filterBy} isLoading={advertisementRevenueAnalyticsQuery.isLoading} payments={advertisementRevenueAnalyticsQuery.data?.failedAmount} title={`Failed amount ${formatedTitle}`} />
        </div>
    )
}

export default AdvertisementRevenueAnalyticsContainer