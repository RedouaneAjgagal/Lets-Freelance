import { useQueryClient } from "@tanstack/react-query";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import toUpperCase from "../../../utils/toUpperCase";

type FilterEvent = "profile" | "service" | "job" | "all events";

type EventReportsFilterByEventsItemProps = {
    onClose: () => void;
    event: FilterEvent;
    setEventHandler: (event: FilterEvent) => void;
    currentlySelected: FilterEvent;
}

const EventReportsFilterByEventsItem = (props: React.PropsWithoutRef<EventReportsFilterByEventsItemProps>) => {
    const queryClient = useQueryClient();
    const customSearchParams = useCustomSearchParams();

    const event = toUpperCase({
        value: props.event
    });

    const selectEventHandler = () => {
        props.setEventHandler(props.event);
        props.onClose();

        customSearchParams.setSearchParams(...[{
            key: "event",
            value: props.event === "all events" ? "" : props.event
        }]);

        queryClient.removeQueries({ queryKey: ["eventReports"] });
    }

    return (
        <button key={props.event} onClick={selectEventHandler} className={`py-[0.35rem] px-3 w-full text-left border-b last:border-b-0 ${props.currentlySelected === props.event ? "bg-slate-800 text-white" : ""}`}>
            {event}
        </button>
    )
}

export default EventReportsFilterByEventsItem