import { useState } from "react";
import useServiceRevenueAnalyticsQuery from "../../hooks/useServiceRevenueAnalyticsQuery"
import ChartsNavbar, { FilterValues } from "../ChartsNavbar";
import { ServiceRevenueAnalyticsPayload } from "../../services/serviceRevenueAnalytics";
import { useQueryClient } from "@tanstack/react-query";
import RevenueAnalyticsWrapper from "./RevenueAnalyticsWrapper";


const ServiceRevenueAnalyticsContainer = () => {
    const queryClient = useQueryClient();
    const [filterBy, setFilterBy] = useState<FilterValues>("week");

    const serviceRevenuesPayload: ServiceRevenueAnalyticsPayload = {};

    if (filterBy !== "all") {
        serviceRevenuesPayload.payment_duration = filterBy;
    };

    const serviceRevenueAnalyticsQuery = useServiceRevenueAnalyticsQuery(serviceRevenuesPayload);

    const selectFilterHandler = (filterValue: FilterValues) => {
        setFilterBy(filterValue);

        queryClient.removeQueries({ queryKey: ["serviceRevenueAnalytics"] });
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
                <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Services revenue overview" />
            </div>
            <RevenueAnalyticsWrapper isLoading={serviceRevenueAnalyticsQuery.isLoading} payments={serviceRevenueAnalyticsQuery.data?.paidPayments} title={`Processed payments ${formatedTitle}`} filterBy={filterBy} barDataKey="Processed payments" />
            <RevenueAnalyticsWrapper isLoading={serviceRevenueAnalyticsQuery.isLoading} payments={serviceRevenueAnalyticsQuery.data?.pendingPayments} title={`Pending payments ${formatedTitle}`} filterBy={filterBy} barDataKey="Pending payments" />
            <RevenueAnalyticsWrapper isLoading={serviceRevenueAnalyticsQuery.isLoading} payments={serviceRevenueAnalyticsQuery.data?.refundedPayments} title={`Refunded payments ${formatedTitle}`} filterBy={filterBy} barDataKey="Refunded payments" />
        </div>
    )
}

export default ServiceRevenueAnalyticsContainer