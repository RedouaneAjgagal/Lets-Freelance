import { TbListSearch } from "react-icons/tb";
import SearchInput from "../../../components/SearchInput"
import { useState } from "react";
import FilterTalentsMenu from "./FilterTalentsMenu";
import useOverflow from "../../../hooks/useOverflow";
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { isValidSearchKeyword } from "../validators/searchTalentsValidators";


const SearchFreelancersNav = () => {
    const customSearch = useCustomSearchParams();
    const searchKeyword = customSearch.getSearchParams({ key: "search" });

    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const openFilterOptionsHandler = () => {
        setIsFilterMenuOpen(true);
    }

    const closeFilterOptionsHandler = () => {
        setIsFilterMenuOpen(false);
    }

    const searchProfilesHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const search = formData.get("search")?.toString() || "";

        if (search === "") {
            customSearch.setSearchParams({
                key: "search",
                value: ""
            });
        }

        const validSearchKeyword = isValidSearchKeyword(search);
        if (!validSearchKeyword) return;

        customSearch.setSearchParams({
            key: "search",
            value: search.trim()
        });
    }

    useOverflow(isFilterMenuOpen);
    return (
        <header className="py-6 px-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <SearchInput onSubmit={searchProfilesHandler} searchValue={searchKeyword || ""} />
                <div className="flex items-center justify-center">
                    <button onClick={openFilterOptionsHandler} className="relative border-2 rounded-md p-1 border-purple-600 text-purple-700">
                        <TbListSearch size={22} />
                        {true ?
                            <span className="absolute flex  justify-center items-center h-5 w-5 rounded-full font-medium bg-purple-600 text-white text-sm -top-[.6rem] -right-[.7rem]">
                                2
                            </span>
                            : null
                        }
                    </button>
                </div>
            </div>
            <FilterTalentsMenu isOpen={isFilterMenuOpen} onClose={closeFilterOptionsHandler} />
            <h1 className="text-[1.7rem] leading-9 font-semibold text-slate-900 border-b pb-2 border-slate-300">Browse Talents</h1>
        </header>
    )
}

export default SearchFreelancersNav