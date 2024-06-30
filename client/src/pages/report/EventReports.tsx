import Loading from "../../components/Loading";
import { EventReportsContainer, GetEventReportsPayload, useGetEventReportsQuery } from "../../features/report"
import useCustomSearchParams from "../../hooks/useCustomSearchParams";

const EventReports = () => {
    const customSearchParams = useCustomSearchParams();
    const sort = customSearchParams.getSearchParams({
        key: "sort"
    });

    const duration = customSearchParams.getSearchParams({
        key: "duration"
    });

    const eventQuery = customSearchParams.getSearchParams({
        key: "event"
    });

    const pageQuery = customSearchParams.getSearchParams({
        key: "page"
    });

    const eventReportsPayload: GetEventReportsPayload = {};

    if (sort && (
        sort === "newest" ||
        sort === "oldest"
    )) {
        eventReportsPayload.sort = sort;
    }

    if (duration && (
        duration === "day" ||
        duration === "week" ||
        duration === "month" ||
        duration === "year"
    )) {
        eventReportsPayload.duration = duration;
    }

    if (eventQuery && (
        eventQuery === "profile" ||
        eventQuery === "service" ||
        eventQuery === "job"
    )) {
        eventReportsPayload.event = eventQuery;
    }

    const isValidPage = pageQuery && !Number.isNaN(Number(pageQuery));
    if (isValidPage) {
        eventReportsPayload.page = Number.parseInt(pageQuery);
    }

    const getEventReportsQuery = useGetEventReportsQuery(eventReportsPayload);

    return (
        <main className="p-4 bg-purple-100/30 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">
                Event Reports
            </h1>
            {getEventReportsQuery.isLoading ?
                <Loading type="table" />
                : <EventReportsContainer eventReports={getEventReportsQuery.data!} isLoading={getEventReportsQuery.isLoading || getEventReportsQuery.isRefetching} />
            }
        </main>
    )
}

export default EventReports