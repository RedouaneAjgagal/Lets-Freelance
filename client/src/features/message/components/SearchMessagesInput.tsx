import { BiSearch } from "react-icons/bi"


const SearchMessagesInput = () => {
    return (
        <div className="p-4">
            <div className="flex items-center relative">
                <div className="absolute left-4 text-slate-600 pointer-events-none">
                    <BiSearch size={18} />
                </div>
                <input type="search" name="searchMessages" id="searchMessages" className="rounded outline-none w-full h-full placeholder:text-slate-500 p-3 pl-10 bg-blue-100/30 border border-transparent focus:border-slate-300" placeholder="Search Contacts.." />
            </div>
        </div>
    )
}

export default SearchMessagesInput