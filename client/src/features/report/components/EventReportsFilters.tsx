import EventReportsFilterByDuration from "./EventReportsFilterByDuration"
import EventReportsFilterByEvents from "./EventReportsFilterByEvents"
import EventReportsFilterBySorting from "./EventReportsFilterBySorting"


const EventReportsFilters = () => {
    return (
        <nav className="flex justify-between items-center flex-wrap gap-x-1 gap-y-2">
            <EventReportsFilterBySorting />
            <div className="flex items-center flex-wrap gap-2">
                <EventReportsFilterByEvents />
                <EventReportsFilterByDuration />
            </div>
        </nav>
    )
}

export default EventReportsFilters