import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import EventReportsFilterByEventsItem from "./EventReportsFilterByEventsItem";
import toUpperCase from "../../../utils/toUpperCase";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";


const EventReportsFilterByEvents = () => {
    const customSearchParams = useCustomSearchParams();

    const eventQuery = customSearchParams.getSearchParams({
        key: "event"
    });

    const events = ["profile", "service", "job", "all events"] as const;

    const getEvent = events.find(event => eventQuery === event);

    const [event, setEvent] = useState<typeof events[number]>(
        !eventQuery || !getEvent ? "all events" : getEvent
    );

    const [isFilterEventMenuOpen, setIsFilterEventMenuOpen] = useState(false);

    const toggleEventsMenuHandler = () => {
        setIsFilterEventMenuOpen(prev => !prev);
    }

    const closeMenuHandler = () => {
        setIsFilterEventMenuOpen(false);
    };

    const setEventHandler = (event: typeof events[number]) => {
        setEvent(event);
    }

    const upperCaseEvent = toUpperCase({
        value: event
    });

    return (
        <div className="relative">
            <button onClick={toggleEventsMenuHandler} className="px-3 py-1 border rounded border-slate-300 flex justify-between bg-white min-w-[8rem]">
                {upperCaseEvent || "All events"}
                <MdArrowBackIos className={`-rotate-90 transition-all text-slate-800`} />
            </button>
            {isFilterEventMenuOpen
                ? <div className="absolute right-0 top-10 bg-white border rounded border-slate-300 min-w-[8rem] max-w-[8rem] z-20 shadow-lg">
                    {events.map(getEvent => <EventReportsFilterByEventsItem key={getEvent} event={getEvent} onClose={closeMenuHandler} setEventHandler={setEventHandler} currentlySelected={event} />)}
                </div>
                : null
            }
        </div>
    )
}

export default EventReportsFilterByEvents