import { TbListSearch } from "react-icons/tb";
import SearchInput from "../../../components/SearchInput"


const SearchFreelancersNav = () => {
    const openFilterOptionsHandler = () => {
        console.log("Open Filters");
    }

    const searchProfilesHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Search freelancers..");
    }
    return (
        <header className="py-6 px-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <SearchInput onSubmit={searchProfilesHandler} searchValue="" />
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
            <h1 className="text-[1.7rem] leading-9 font-semibold text-slate-900 border-b pb-2 border-slate-300">Browse Talents</h1>
        </header>
    )
}

export default SearchFreelancersNav