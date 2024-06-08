import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import EventReportsFilterByDurationItem from "./EventReportsFilterByDurationItem";


const EventReportsFilterByDuration = () => {
    const customSearchParams = useCustomSearchParams();

    const duration = customSearchParams.getSearchParams({
        key: "duration"
    });

    const filters = [
        {
            name: "Today",
            value: "day"
        },
        {
            name: "Last 7 days",
            value: "week"
        },
        {
            name: "This month",
            value: "month"
        },
        {
            name: "This year",
            value: "year"
        },
        {
            name: "All time",
            value: "all"
        }
    ] as const;

    const getDuration = filters.find(filter => duration && duration === filter.value);

    const [isFilterDurationMenuOpen, setIsFilterDurationMenuOpen] = useState(false);
    const [currentlySelected, setCurrentlySelected] = useState<"day" | "week" | "month" | "year" | "all">(getDuration?.value || "all");

    const toggleDurationMenuHandler = () => {
        setIsFilterDurationMenuOpen(prev => !prev);
    };

    const closeDurationMenuHandler = () => {
        setIsFilterDurationMenuOpen(false);
    }

    const filterName = filters.find(filter => filter.value === currentlySelected);

    const setCurrenlySelectedFilterHandler = (filter: "day" | "week" | "month" | "year" | "all") => {
        setCurrentlySelected(filter);
    }

    return (
        <div className="relative">
            <button onClick={toggleDurationMenuHandler} className="px-3 py-1 border rounded border-slate-300 flex justify-between bg-white min-w-[9rem]">
                {filterName?.name || "All time"}
                <MdArrowBackIos className={`-rotate-90 transition-all text-slate-800`} />
            </button>
            {isFilterDurationMenuOpen
                ? <div className="absolute right-0 top-10 bg-white border rounded border-slate-300 min-w-[9rem] max-w-[9rem] z-20 shadow-lg">
                    {
                        filters.map(filter => <EventReportsFilterByDurationItem key={filter.value} currentlySelected={currentlySelected} duration={filter} isFilter={filterName ? true : false} onClose={closeDurationMenuHandler} setCurrentlySelected={setCurrenlySelectedFilterHandler} />)
                    }
                </div>
                : null}
        </div>
    )
}

export default EventReportsFilterByDuration