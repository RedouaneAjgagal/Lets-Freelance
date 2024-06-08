import { useQueryClient } from "@tanstack/react-query";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";

type DurationValue = "day" | "week" | "month" | "year" | "all";

type EventReportsFilterByDurationItemProps = {
    onClose: () => void;
    setCurrentlySelected: (filter: DurationValue) => void;
    duration: {
        value: DurationValue;
        name: "Today" | "Last 7 days" | "This month" | "This year" | "All time"
    }
    currentlySelected: DurationValue;
    isFilter: boolean;
}

const EventReportsFilterByDurationItem = (props: React.PropsWithoutRef<EventReportsFilterByDurationItemProps>) => {
    const queryClient = useQueryClient();

    const customSearchParams = useCustomSearchParams();

    const selectFilterHandler = () => {
        customSearchParams.setSearchParams({
            key: "duration",
            value: !props.isFilter || props.duration.value === "all" ? "" : props.duration.value
        });

        props.setCurrentlySelected(props.duration.value);
        props.onClose();

        queryClient.removeQueries({ queryKey: ["eventReports"] });
    };

    return (
        <button key={props.duration.value} onClick={selectFilterHandler} className={`py-[0.35rem] px-3 w-full text-left border-b last:border-b-0 ${props.currentlySelected === props.duration.value ? "bg-slate-800 text-white" : ""}`}>
            {props.duration.name}
        </button>
    )
}

export default EventReportsFilterByDurationItem