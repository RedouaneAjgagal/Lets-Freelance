import React, { useEffect, useRef } from "react"
import Overlay from "../../../layouts/Overlay";
import { BsX } from "react-icons/bs";
import FilterByCategory from "./FilterByCategory";
import SelectedFilters from "./SelectedFilters";
import FilterByProjectType from "./FilterByProjectType";
import FilterByProjectPrice from "./FilterByProjectPrice";
import FilterByProjectLength from "./FilterByProjectLength";
import FilterByHoursPerWeek from "./FilterByHoursPerWeek";
import FilterByLocationType from "./FilterByLocationType";
import FilterByExperienceLevel from "./FilterByExperienceLevel";
import { PrimaryButton } from "../../../layouts/brand";
import { BiArrowBack } from "react-icons/bi";

type FilterJobsMenuDesktopSize = {
    isDesktopLayout: true;
};

type FilterJobsMenuProps = {
    isDesktopLayout?: false;
    onCloseMenu: () => void;
    isMenuOpen: boolean;
} | FilterJobsMenuDesktopSize;

const FilterJobsMenu = (props: React.PropsWithoutRef<FilterJobsMenuProps>) => {
    const filterMenuRef = useRef<HTMLDivElement>(null);

    let useEffectArr: React.DependencyList = [];

    if (!props.isDesktopLayout) {
        useEffectArr = [props.isMenuOpen];
    }

    useEffect(() => {
        if (props.isDesktopLayout) return;
        if (props.isMenuOpen) {
            filterMenuRef.current?.scrollTo({
                top: 0,
                behavior: "instant"
            })
        } else {
            window.scrollTo({
                top: 0,
                behavior: "instant"
            });
        }
    }, useEffectArr);

    return (
        <section className="relative">
            {!props.isDesktopLayout && props.isMenuOpen ?
                <Overlay onClose={props.onCloseMenu} />
                : null
            }
            <div className={`[&>div>h4]:lg:font-semibold flex flex-col gap-6 ${props.isDesktopLayout
                ? "p-8 px-4 lg:pr-6 lg:border-r lg:h-full"
                : `bg-white h-screen fixed w-full p-4 transition-all text-slate-600 font-medium z-[90] overflow-y-scroll bottom-0 ${props.isMenuOpen ? "left-0" : "-left-full"}
                `}`} ref={filterMenuRef}>
                {!props.isDesktopLayout
                    ? <div className="flex items-center justify-between text-slate-700 pb-4 border-b">
                        <h3>All Filters</h3>
                        <button onClick={props.onCloseMenu} className="bg-purple-100/70 rounded p-1">
                            <BsX size={24} />
                        </button>
                    </div>
                    : null
                }
                <SelectedFilters />
                <FilterByCategory />
                <FilterByProjectType isDesktopLayout={props.isDesktopLayout} />
                <FilterByProjectPrice isDesktopLayout={props.isDesktopLayout} />
                <FilterByProjectLength />
                <FilterByHoursPerWeek isDesktopLayout={props.isDesktopLayout} />
                <FilterByExperienceLevel />
                <FilterByLocationType isDesktopLayout={props.isDesktopLayout} />
                {!props.isDesktopLayout
                    ? <PrimaryButton disabled={false} fullWith justifyConent="center" style="outline" type="button" x="md" y="md" onClick={props.onCloseMenu}>
                        Filter Jobs
                        <BiArrowBack className="rotate-[135deg]" />
                    </PrimaryButton>
                    : null
                }
            </div>
        </section>
    )
}

export default FilterJobsMenu