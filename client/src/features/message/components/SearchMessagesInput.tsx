import { useEffect, useState } from "react"
import { BiSearch } from "react-icons/bi"
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";


const SearchMessagesInput = () => {
    const customSearchParams = useCustomSearchParams();

    const searchQuery = customSearchParams.getSearchParams({
        key: "search"
    }) || "";

    const [search, setSearch] = useState<string>(searchQuery);
    let isFetch = true;


    const setSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toString() || "";
        setSearch(searchValue);
    }


    useEffect(() => {
        if (!isFetch) return;
        isFetch = false;

        const time = setTimeout(() => {
            customSearchParams.setSearchParams({
                key: "search",
                value: search
            });
        }, 800);

        return () => clearTimeout(time);
    }, [search]);

    return (
        <div className="p-4">
            <div className="flex items-center relative">
                <div className="absolute left-4 text-slate-600 pointer-events-none">
                    <BiSearch size={18} />
                </div>
                <input onChange={setSearchHandler} value={search} type="search" name="searchMessages" id="searchMessages" className="rounded outline-none w-full h-full placeholder:text-slate-500 p-3 pl-10 bg-blue-100/30 border border-transparent focus:border-slate-300" placeholder="Search Contacts.." />
            </div>
        </div>
    )
}

export default SearchMessagesInput