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

type FilterTalentsMenuProps = {
  isOpen: boolean;
  onClose: () => void;
}

const FilterTalentsMenu = (props: FilterTalentsMenuProps) => {

  const rates = [4.5, 4, 3];


  return (
    <section className="relative">
      {props.isOpen ?
        <Overlay onClose={props.onClose} />
        : null
      }
      <div className={`bg-[#fdfdfd] h-3/4 fixed w-full flex flex-col gap-6 pb-8 transition-all text-slate-600 font-medium z-[90] overflow-y-scroll left-0 rounded-t-xl ${props.isOpen ? "bottom-0" : "-bottom-full"}`}>
        <div className="flex items-center justify-between text-slate-700 pb-4 px-4  sticky top-0 left-0 bg-white pt-4 shadow-sm border-b z-30">
          <h3>All Filters</h3>
          <button className="bg-purple-100/70 rounded p-1" onClick={props.onClose}>
            <BsX size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-8 px-4">
          <SearchTalentBadgeFilter />
          <SearchTalentRatingFilter rates={rates} />
          <SearchTalentCategoryFilter SIZE={5} />
          <SearchTalentRevenueFilter from={0} to={10000} step={100} />
          <SearchTalentHourlyRateFilter />
          <SearchTalentType />
          <SearchTalentEnglishLevelFilter SIZE={4} />
          <SearchTalentLocationFilter />
        </div>
      </div>
    </section>
  )
}

export default FilterTalentsMenu