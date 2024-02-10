import { BiSearch } from "react-icons/bi";

type SearchInputProps = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    searchValue: string;
}

const SearchInput = (props: React.PropsWithoutRef<SearchInputProps>) => {
    return (
        <form onSubmit={props.onSubmit} className="w-full">
            <div className="flex items-center border border-slate-800 rounded h-8">
                <button type="submit" className="h-full px-2 text-lg">
                    <BiSearch className="-mb-[0.1rem]" />
                </button>
                <input type="search" placeholder="Search" name="search" className="rounded bg-transparent outline-none w-full h-full placeholder:font-medium placeholder:text-slate-500" defaultValue={props.searchValue} />
            </div>
        </form>
    )
}

export default SearchInput