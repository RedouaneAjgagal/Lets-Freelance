import TableHead from "../../../components/TableHead";
import { EventReportsReponse } from "../services/getEventReports";
import EventReportItem from "./EventReportItem";

type EventReportsTableProps = {
    eventReports: EventReportsReponse["reports"];
}

const EventReportsTable = (props: React.PropsWithoutRef<EventReportsTableProps>) => {
    const tableHeads = ["Event", "Submitted By", "Subject", "Reported At", "Actions"];

    return (
        <section className='bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2'>
            {props.eventReports.length ?
                <table className="text-left w-full">
                    <TableHead tableHeads={tableHeads} />
                    <tbody>
                        {props.eventReports.map(eventReport => <EventReportItem key={eventReport._id} eventReport={eventReport} />)}
                    </tbody>
                </table>
                : <>
                    <h2 className="text-xl font-medium">Empty..</h2>
                    <p className="text-slate-500">There is no event contracts</p>
                </>
            }
        </section>
    )
}

export default EventReportsTable