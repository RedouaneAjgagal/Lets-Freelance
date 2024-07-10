import { BiSearch } from "react-icons/bi";

type SearchInputProps = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    searchValue: string;
}

const SearchInput = (props: React.PropsWithoutRef<SearchInputProps>) => {
    return (
        <form onSubmit={props.onSubmit} className="w-full lg:w-1/2 lg:mt-4">
            <div className="flex items-center border border-slate-400 rounded h-8 focus-within:border-slate-800 lg:h-10 lg:border-slate-300 lg:border-2">
                <button type="submit" className="h-full px-2 text-lg lg:px-3">
                    <BiSearch className="-mb-[0.1rem]" />
                </button>
                <input type="search" placeholder="Search" name="search" className="rounded bg-transparent outline-none w-full h-full placeholder:font-medium placeholder:text-slate-500 lg:text-lg lg:placeholder:text-base" defaultValue={props.searchValue} />
            </div>
        </form>
    )
}

export default SearchInput