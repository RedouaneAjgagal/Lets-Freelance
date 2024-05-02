import { BsX } from "react-icons/bs";
import Overlay from "../../../layouts/Overlay";
import SearchTalentBadgeFilter from "./SearchTalentBadgeFilter";
import SearchTalentRatingFilter from "./SearchTalentRatingFilter";
import SearchTalentRevenueFilter from "./SearchTalentRevenueFilter";
import SearchTalentHourlyRateFilter from "./SearchTalentHourlyRateFilter";
import SearchTalentCategoryFilter from "./SearchTalentCategoryFilter";
import SearchTalentEnglishLevelFilter from "./SearchTalentEnglishLevelFilter";
import SearchTalentLocationFilter from "./SearchTalentLocationFilter";
import SearchTalentType from "./SearchTalentType";
import { SEARCHED_TALENT_RATES } from "../helpers/getValidSearchedTalentQueries";
import { PrimaryButton } from "../../../layouts/brand";
import { BiArrowBack } from "react-icons/bi";
import useSearchedTalentsQueries from "../hooks/useSearchedTalentsQueries";
import RemoveTalentFilter from "./RemoveTalentFilter";
import ClearAllQueriesButton from "./ClearAllQueriesButton";
import { useEffect, useRef } from "react";

type FilterTalentsMenuProps = {
  isOpen: boolean;
  onClose: () => void;
}

const FilterTalentsMenu = (props: FilterTalentsMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const searchedTalentsQueries = useSearchedTalentsQueries();
  delete searchedTalentsQueries.search;

  const searchedQueries = Object.entries(searchedTalentsQueries);

  useEffect(() => {
    if (props.isOpen) {
      menuRef.current!.scrollTo({
        behavior: "instant",
        top: 0
      });
    }
  }, [props.isOpen]);


  return (
    <section className="relative">
      {props.isOpen ?
        <Overlay onClose={props.onClose} />
        : null
      }
      <div ref={menuRef} className={`bg-[#fdfdfd] h-3/4 fixed w-full flex flex-col gap-6 pb-6 transition-all text-slate-600 font-medium z-[90] overflow-y-scroll left-0 rounded-t-xl ${props.isOpen ? "bottom-0" : "-bottom-full"}`}>
        <div className="flex items-center justify-between text-slate-700 pb-4 px-4  sticky top-0 left-0 bg-white pt-4 shadow-sm border-b z-30">
          <h3>All Filters</h3>
          <button className="bg-purple-100/70 rounded p-1" onClick={props.onClose}>
            <BsX size={24} />
          </button>
        </div>
        {searchedQueries.length ?
          <div className="flex gap-2 flex-wrap px-4">
            {searchedQueries.map(([key, value]) => (
              <RemoveTalentFilter key={key} queryKey={key} queryValue={value} />
            ))}
            {searchedQueries.length > 1 ?
              <ClearAllQueriesButton />
              : null
            }
          </div>
          : null
        }
        <div className="flex flex-col gap-8 px-4">
          <SearchTalentBadgeFilter />
          <SearchTalentRatingFilter rates={SEARCHED_TALENT_RATES} />
          <SearchTalentCategoryFilter SIZE={5} />
          <SearchTalentRevenueFilter from={0} to={10000} step={100} />
          <SearchTalentHourlyRateFilter />
          <SearchTalentType />
          <SearchTalentEnglishLevelFilter SIZE={4} />
          <SearchTalentLocationFilter />
          <PrimaryButton disabled={false} fullWith justifyConent="center" style="outline" type="button" x="md" y="md" onClick={props.onClose}>
            Filter Talents
            <BiArrowBack className="rotate-[135deg]" />
          </PrimaryButton>
        </div>
      </div>
    </section >
  )
}

export default FilterTalentsMenu