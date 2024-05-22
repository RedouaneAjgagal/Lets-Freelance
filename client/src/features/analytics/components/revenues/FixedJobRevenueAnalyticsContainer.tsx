import { useQueryClient } from "@tanstack/react-query";
import ChartsNavbar, { FilterValues } from "../ChartsNavbar";
import useFixedJobRevenueAnalyticsQuery from "../../hooks/useFixedJobRevenueAnalyticsQuery";
import { FixedjobRevenueAnalyticsPayload } from "../../services/fixedjobRevenueAnalytics";
import RevenueAnalyticsWrapper from "./RevenueAnalyticsWrapper";
import { useState } from "react";


const FixedJobRevenueAnalyticsContainer = () => {
    const queryClient = useQueryClient();
    const [filterBy, setFilterBy] = useState<FilterValues>("week");

    const fixedJobRevenuesPayload: FixedjobRevenueAnalyticsPayload = {};

    if (filterBy !== "all") {
        fixedJobRevenuesPayload.payment_duration = filterBy;
    };

    const fixedJobRevenueAnalyticsQuery = useFixedJobRevenueAnalyticsQuery(fixedJobRevenuesPayload);

    const selectFilterHandler = (filterValue: FilterValues) => {
        setFilterBy(filterValue);

        queryClient.removeQueries({ queryKey: ["fixedJobRevenueAnalytics"] });
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
                <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Fixed job revenue overview" />
            </div>
            <RevenueAnalyticsWrapper isLoading={fixedJobRevenueAnalyticsQuery.isLoading} payments={fixedJobRevenueAnalyticsQuery.data?.paidPayments} title={`Processed payments ${formatedTitle}`} filterBy={filterBy} barDataKey="Processed payments" />
            <RevenueAnalyticsWrapper isLoading={fixedJobRevenueAnalyticsQuery.isLoading} payments={fixedJobRevenueAnalyticsQuery.data?.pendingPayments} title={`Pending payments ${formatedTitle}`} filterBy={filterBy} barDataKey="Pending payments" />
            <RevenueAnalyticsWrapper isLoading={fixedJobRevenueAnalyticsQuery.isLoading} payments={fixedJobRevenueAnalyticsQuery.data?.refundedPayments} title={`Refunded payments ${formatedTitle}`} filterBy={filterBy} barDataKey="Refunded payments" />
        </div>
    )
}

export default FixedJobRevenueAnalyticsContainer