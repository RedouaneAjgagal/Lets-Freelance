import { BiArrowBack, BiSearch } from "react-icons/bi";
import { useState } from "react";
import SearchBy from "./SearchBy";

interface Props {
    isShown: boolean;
    closeModel: () => void;
}

const SearchModel = (props: React.PropsWithoutRef<Props>) => {
    const [searchBy, setSearchBy] = useState("talent");
    const [search, setSearch] = useState("");
    const searchHandler = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(search);
        console.log(searchBy);
        console.log("Searching..");
    }

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    }

    const searchByhandler = (value: string) => {
        setSearchBy(value);
    }

    return (
        <div className={`bg-white min-h-screen fixed top-0 w-full duration-150 z-50 ${props.isShown ? "right-0" : "-right-full"}`}>
            <div className="px-4 py-3 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={props.closeModel} className="text-2xl">
                        <BiArrowBack />
                    </button>
                    <form onSubmit={searchHandler} className="w-full">
                        <div className="flex items-center border border-slate-800 rounded h-8">
                            <button onClick={searchHandler} className="h-full px-2 text-lg">
                                <BiSearch className="-mb-[0.1rem]" />
                            </button>
                            <input onChange={onSearch} value={search} type="search" placeholder="Search" name="search" className="rounded bg-transparent outline-none w-full h-full placeholder:font-medium placeholder:text-slate-500" />
                        </div>
                    </form>
                </div>
                <div className="flex items-start gap-6 border-b text-slate-400 font-medium">
                    <SearchBy searchByHandler={searchByhandler} value="Talent" currentTarget={searchBy} />
                    <SearchBy searchByHandler={searchByhandler} value="Projects" currentTarget={searchBy} />
                    <SearchBy searchByHandler={searchByhandler} value="Jobs" currentTarget={searchBy} />
                </div>
            </div>
        </div>
    )
}

export default SearchModel