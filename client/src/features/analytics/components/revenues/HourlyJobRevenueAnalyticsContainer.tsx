import { useState } from "react";
import useHourlyJobRevenueAnalyticsQuery from "../../hooks/useHourlyJobRevenueAnalyticsQuery"
import { HourlyJobRevenueAnalyticsPayload } from "../../services/HourlyJobRevenueAnalytics";
import ChartsNavbar, { FilterValues } from "../ChartsNavbar";
import { useQueryClient } from "@tanstack/react-query";
import RevenueAnalyticsWrapper from "./RevenueAnalyticsWrapper";


const HourlyJobRevenueAnalyticsContainer = () => {
    const queryClient = useQueryClient();
    const [filterBy, setFilterBy] = useState<FilterValues>("week");

    const hourlyJobRevenuesPayload: HourlyJobRevenueAnalyticsPayload = {};

    if (filterBy !== "all") {
        hourlyJobRevenuesPayload.payment_duration = filterBy;
    };

    const hourlyJobRevenueAnalyticsQuery = useHourlyJobRevenueAnalyticsQuery(hourlyJobRevenuesPayload);

    const selectFilterHandler = (filterValue: FilterValues) => {
        setFilterBy(filterValue);

        queryClient.removeQueries({ queryKey: ["hourlyJobRevenueAnalytics"] });
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
                <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Hourly job revenue overview" />
            </div>
            <RevenueAnalyticsWrapper isLoading={hourlyJobRevenueAnalyticsQuery.isLoading} payments={hourlyJobRevenueAnalyticsQuery.data?.paidPayments} title={`Processed payments ${formatedTitle}`} filterBy={filterBy} barDataKey="Processed payments" />
            <RevenueAnalyticsWrapper isLoading={hourlyJobRevenueAnalyticsQuery.isLoading} payments={hourlyJobRevenueAnalyticsQuery.data?.refundedPayments} title={`Refunded payments ${formatedTitle}`} filterBy={filterBy} barDataKey="Refunded payments" />
        </div>
    )
}

export default HourlyJobRevenueAnalyticsContainer