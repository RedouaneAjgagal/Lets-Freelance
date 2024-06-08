import { EventReportsReponse } from "../services/getEventReports"
import EventReportsFilterByPage from "./EventReportsFilterByPage";
import EventReportsFilters from "./EventReportsFilters";
import EventReportsTable from "./EventReportsTable";

type EventReportsContainerProps = {
    eventReports: EventReportsReponse;
    isLoading: boolean;
}

const EventReportsContainer = (props: React.PropsWithoutRef<EventReportsContainerProps>) => {


    return (
        <div className="flex flex-col gap-2">
            <EventReportsFilters />
            <EventReportsTable eventReports={props.eventReports.reports} />
            <EventReportsFilterByPage numOfpagesLeft={props.eventReports.numOfpagesLeft} isLoading={props.isLoading} />
        </div>
    )
}

export default EventReportsContainer