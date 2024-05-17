import { useState } from "react";
import useReportsAnalyticsQuery from "../../hooks/useReportsAnalyticsQuery"
import { ReportsAnalyticsPayload } from "../../services/reportsAnalytics";
import ChartsNavbar, { FilterValues } from "../ChartsNavbar";
import { useQueryClient } from "@tanstack/react-query";
import CreatedReportsAnalytics from "./CreatedReportsAnalytics";
import ReportedEventsAnalytics from "./ReportedEventsAnalytics";


const ReportsAnalyticsContainer = () => {
    const queryClient = useQueryClient();

    const [filterBy, setFilterBy] = useState<FilterValues>("week");

    const reportsPayload: ReportsAnalyticsPayload = {};

    if (filterBy !== "all") {
        reportsPayload.created_report_duration = filterBy;
    };

    const reportsAnalyticsQuery = useReportsAnalyticsQuery(reportsPayload);

    const selectFilterHandler = (filteValue: FilterValues) => {
        setFilterBy(filteValue);

        queryClient.removeQueries({ queryKey: ["reportsAnalytics"] });
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
                <ChartsNavbar filterValue={filterBy} isFilter={true} onSelectFilter={selectFilterHandler} title="Reports overview" />
            </div>
            <CreatedReportsAnalytics filterBy={filterBy} isLoading={reportsAnalyticsQuery.isLoading} reports={reportsAnalyticsQuery.data?.reportedAt} totalReports={reportsAnalyticsQuery.data?.totalReports} title={`Created reports ${formatedTitle}`} />
            <ReportedEventsAnalytics isLoading={reportsAnalyticsQuery.isLoading} reportedEvents={reportsAnalyticsQuery.data?.reportedEvents} totalReports={reportsAnalyticsQuery.data?.totalDurationReports} title={`Report types ${formatedTitle}`} />
        </div>
    )
}

export default ReportsAnalyticsContainer