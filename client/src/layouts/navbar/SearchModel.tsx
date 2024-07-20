import { BiArrowBack, BiSearch } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import SearchBy from "./SearchBy";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { filterSearchedServicesAction } from "../../features/service/redux/filterSearchedServices";
import { useQueryClient } from "@tanstack/react-query";
import { PrimaryButton } from "../brand";
import { BsArrowDown } from "react-icons/bs";

interface Props {
    isShown: boolean;
    closeSearchModal: () => void;
    closeNavbar: () => void
}

const SearchModel = (props: React.PropsWithoutRef<Props>) => {
    const queryClient = useQueryClient();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchBy, setSearchBy] = useState<"talent" | "services" | "jobs">("talent");
    const [search, setSearch] = useState("");


    const [isDropmenuOpen, setIsDropmenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dropdownLaptopRef = useRef<HTMLDivElement>(null);

    const searchHandler = (e: React.FormEvent) => {
        e.preventDefault();
        props.closeNavbar();

        switch (searchBy) {
            case "services":
                navigate("/services?nav_search=true");
                dispatch(filterSearchedServicesAction.filterBySearch(search));
                break;

            case "jobs":
                queryClient.removeQueries({ queryKey: ["jobs"] });
                navigate(`/jobs?search=${search}`);
                break;

            case "talent":
                queryClient.removeQueries({ queryKey: ["talents"] });
                navigate(`/profiles/?search=${search}`);
                break;
            default:
                break;
        }

        setSearch("");
    };

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    const searchByhandler = (value: "talent" | "services" | "jobs") => {
        setSearchBy(value);
    };

    useEffect(() => {
        if (!props.isShown) return;
        setSearch("");
    }, [props.isShown]);

    const searchByValues = ["Talent", "Services", "Jobs"] as const;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropmenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownLaptopRef.current && !dropdownLaptopRef.current.contains(event.target as Node)) {
                if (!props.isShown) return;
                props.closeSearchModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.isShown]);

    return (
        <div ref={dropdownLaptopRef} className={`bg-white min-h-screen fixed top-0 w-full duration-150 ${props.isShown ? "right-0 z-[100] md:z-[20] md:top-14 md:right-20 md:absolute" : "right-full md:absolute md:-top-52"} md:duration-0 md:min-h-min md:w-[16.3rem] md:border md:rounded md:shadow-lg xl:static xl:shadow-none xl:border-none xl:w-96`}>
            <div className="px-4 py-3 flex flex-col gap-3 md:flex-col-reverse xl:flex-row xl:p-0">
                <div className="flex items-center gap-3 xl:w-full">
                    <button onClick={props.closeSearchModal} className="text-2xl md:hidden">
                        <BiArrowBack />
                    </button>
                    <form onSubmit={searchHandler} className="w-full flex flex-col gap-2">
                        <div className="flex items-center border border-slate-800 rounded h-8 md:border-slate-400 md:focus-within:border-slate-700 xl:relative w-full">
                            <button onClick={searchHandler} className="h-full px-2 text-lg">
                                <BiSearch className="-mb-[0.1rem]" />
                            </button>
                            <input onChange={onSearch} value={search} type="search" placeholder={`search ${searchBy}`} name="search" className="rounded bg-transparent outline-none w-full h-full placeholder:font-medium placeholder:text-slate-500 xl:pr-[6.5rem] placeholder:capitalize" />

                        </div>
                        <div className="hidden md:flex xl:hidden">
                            <PrimaryButton disabled={false} fullWith={false} justifyConent="center" style="solid" type="submit" x="lg" y="md" >
                                Search
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
                <div ref={dropdownRef}>
                    <button onClick={() => setIsDropmenuOpen(prev => !prev)} className="hidden xl:absolute xl:right-0 xl:top-0 xl:border xl:border-slate-300 xl:h-8 xl:w-28 xl:pl-3 xl:pr-1 xl:capitalize xl:bg-slate-100  xl:rounded-r xl:font-medium xl:flex xl:items-center xl:gap-1 xl:z-10 xl:justify-between">
                        {searchBy}
                        <BsArrowDown />
                    </button>
                    <div className={`bg-white flex items-start gap-6 border-b text-slate-400 font-medium xl:flex-col xl:absolute xl:right-0 xl:-top-44 xl:w-44 xl:gap-0 xl:z-50 xl:rounded xl:shadow-lg xl:border xl:border-slate-300 ${isDropmenuOpen ? "xl:top-10" : ""}`}>
                        {searchByValues.map(searchByValue => (
                            <SearchBy key={searchByValue} searchByHandler={searchByhandler} value={searchByValue} currentTarget={searchBy} closeDropdownHandler={() => setIsDropmenuOpen(false)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchModel