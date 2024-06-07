import Loading from "../../components/Loading";
import { EventReportsContainer, GetEventReportsPayload, useGetEventReportsQuery } from "../../features/report"

const EventReports = () => {
    const eventReportsPayload: GetEventReportsPayload = {};

    const getEventReportsQuery = useGetEventReportsQuery(eventReportsPayload);

    return (
        <main className="p-4 bg-purple-100/30 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">
                Event Reports
            </h1>
            {getEventReportsQuery.isLoading ?
                <Loading />
                : <EventReportsContainer eventReports={getEventReportsQuery.data!} />
            }
        </main>
    )
}

export default EventReports