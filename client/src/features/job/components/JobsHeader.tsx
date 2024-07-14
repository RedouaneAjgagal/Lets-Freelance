import { useQueryClient } from "@tanstack/react-query";
import SearchInput from "../../../components/SearchInput"
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { TbListSearch } from "react-icons/tb";
import { useState } from "react";
import FilterJobsMenu from "./FilterJobsMenu";
import useOverflow from "../../../hooks/useOverflow";
import getOnlyValidJobSearchedQueries from "../utils/getOnlyValidJobSearchedQueries";
import { useSearchParams } from "react-router-dom";

const JobsHeader = () => {
    const [URLSearchParams] = useSearchParams();

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const customSearchParams = useCustomSearchParams();

    const queryClient = useQueryClient();

    const searchJobsHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const searchValue = formData.get("search")?.toString();

        customSearchParams.setSearchParams({
            key: "search",
            value: searchValue?.trim() || "",
            removePrev: true
        });

        queryClient.removeQueries({ queryKey: ["jobs"] });
    }

    const searchValue = customSearchParams.getSearchParams({
        key: "search"
    });

    const openFilterHandler = () => {
        setIsFilterOpen(true);
    }

    const closeFilterHandler = () => {
        setIsFilterOpen(false);
    }

    useOverflow(isFilterOpen);

    const filters = getOnlyValidJobSearchedQueries(URLSearchParams);

    delete filters.search;
    delete filters.page;

    if (filters.project_price) {
        const [min, max] = filters.project_price!.split("-");
        if ((+min > +max) || (+min === 0 && +max === 0)) {
            delete filters.project_price;
        }
    }

    return (
        <header className="px-4 pt-7 flex flex-col gap-4 lg:pt-2">
            <div className="flex items-center gap-2">
                <SearchInput onSubmit={searchJobsHandler} searchValue={searchValue || ""} />
                <div className="flex items-center justify-center">
                    <div className="flex lg:hidden">
                        <button onClick={openFilterHandler} className="relative border-2 rounded-md p-1 border-purple-600 text-purple-700">
                            <TbListSearch size={22} />
                            {Object.keys(filters).length ?
                                <span className="absolute flex  justify-center items-center h-5 w-5 rounded-full font-medium bg-purple-600 text-white text-sm -top-[.6rem] -right-[.7rem]">
                                    {Object.keys(filters).length}
                                </span>
                                : null
                            }
                        </button>
                    </div>
                    <FilterJobsMenu isMenuOpen={isFilterOpen} onCloseMenu={closeFilterHandler} />
                </div>
            </div>
            <h1 className="text-[1.7rem] leading-9 font-semibold text-slate-900 border-b pb-2 border-slate-300">
                {searchValue ?
                    `Results for "${searchValue}"`
                    : "Browse jobs"
                }
            </h1>
        </header>
    )
}

export default JobsHeader