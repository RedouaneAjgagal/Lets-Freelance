import { MdArrowBackIos } from "react-icons/md";
import { useState } from "react";

export type FilterValues = "day" | "week" | "month" | "year" | "all";

type ChartsNavbarPropsWithFilter = {
    isFilter: true;
    title: string;
    filterValue: FilterValues;
    onSelectFilter: (filterValue: FilterValues) => void;
};

type ChartsNavbarPropsWithoutFilter = {
    isFilter: false;
    title: string;
};

type ChartsNavbarProps = (ChartsNavbarPropsWithFilter | ChartsNavbarPropsWithoutFilter);

const ChartsNavbar = (props: React.PropsWithoutRef<ChartsNavbarProps>) => {
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const toggleFilterMenu = () => {
        setIsFilterMenuOpen(prev => !prev);
    }

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

    const filterDurations = props.isFilter
        ? filters.map(filter => {
            const selectDurationHandler = () => {
                props.onSelectFilter(filter.value);
                setIsFilterMenuOpen(false);
            }

            return (
                <button onClick={selectDurationHandler} key={filter.value} value={filter.value} className={`py-2 px-2 border-b border-slate-500 w-full text-left last:border-0 ${filter.value === props.filterValue ? "font-semibold" : "font-normal"}`}>
                    {filter.name}
                </button>
            );
        })
        : [];

    const currentSelectFilterName = props.isFilter
        ? filters.find(filter => filter.value === props.filterValue)?.name || "Last 7 days"
        : "";

    return (
        <div className="p-4 pt-4 flex flex-wrap gap-y-2 gap-x-3 justify-between border-b mb-4 relative">
            <h2 className="font-semibold text-xl">{props.title}</h2>
            {props.isFilter ?
                <button onClick={toggleFilterMenu} className="flex px-1 gap-4 border-b border-slate-500">
                    {currentSelectFilterName}
                    <MdArrowBackIos className={`${false ? "rotate-90" : "-rotate-90"} transition-all text-slate-500`} />
                </button>
                : null
            }
            {isFilterMenuOpen && props.isFilter ?
                <div className="absolute right-4 top-14 bg-white flex flex-col border border-slate-500 min-w-[10rem] shadow-lg px-2 text-slate-700 z-30">
                    {filterDurations}
                </div>
                : null
            }
        </div>
    )
}

export default ChartsNavbar