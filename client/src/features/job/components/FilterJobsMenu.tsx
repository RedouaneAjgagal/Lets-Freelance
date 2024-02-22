import React from "react"
import Overlay from "../../../layouts/Overlay";
import { BsX } from "react-icons/bs";
import FilterByCategory from "./FilterByCategory";
import SelectedFilters from "./SelectedFilters";
import FilterByProjectType from "./FilterByProjectType";
import FilterByProjectPrice from "./FilterByProjectPrice";
import FilterByProjectLength from "./FilterByProjectLength";
import FilterByHoursPerWeek from "./FilterByHoursPerWeek";
import FilterByLocationType from "./FilterByLocationType";

type FilterJobsMenuProps = {
    onCloseMenu: () => void;
    isMenuOpen: boolean;
}

const FilterJobsMenu = (props: React.PropsWithoutRef<FilterJobsMenuProps>) => {
    return (
        <section className="relative">
            {props.isMenuOpen ?
                <Overlay onClose={props.onCloseMenu} />
                : null
            }
            <div className={`bg-white h-screen fixed w-full flex flex-col gap-6 p-4 transition-all text-slate-600 font-medium z-[90] overflow-y-scroll bottom-0 ${props.isMenuOpen ? "left-0" : "-left-full"}`}>
                <div className="flex items-center justify-between text-slate-700 pb-4 border-b">
                    <h3>All Filters</h3>
                    <button onClick={props.onCloseMenu} className="bg-purple-100/70 rounded p-1">
                        <BsX size={24} />
                    </button>
                </div>
                <SelectedFilters />
                <FilterByCategory />
                <FilterByProjectType />
                <FilterByProjectPrice />
                <FilterByProjectLength />
                <FilterByHoursPerWeek />
                <FilterByLocationType />
            </div>
        </section>
    )
}

export default FilterJobsMenu