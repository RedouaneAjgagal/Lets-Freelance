import React, { useState } from 'react'
import SearchInput from '../../../components/SearchInput'
import { TbSortDescending } from 'react-icons/tb';
import FilterServicesModal from '../modals/FilterServicesModal';
import useOverflow from '../../../hooks/useOverflow';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { filterSearchedServicesAction } from '../redux/filterSearchedServices';
import SelectedFilters from './SelectedFilters';

type SearchServicesHeaderProps = {
    numOfServices: number;
}

const SearchServicesHeader = (props: React.PropsWithoutRef<SearchServicesHeaderProps>) => {
    const filterServicesQueries = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

    const searchHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchValue = formData.get("search")?.toString();

        if (!searchValue && searchValue !== "") return;

        dispatch(filterSearchedServicesAction.filterBySearch(searchValue));
    }

    const openFilterModalHandler = () => {
        setIsFilterModalOpen(true);
    }

    const closeFilterModalHandler = () => {
        setIsFilterModalOpen(false);
    }

    useOverflow(isFilterModalOpen);

    return (
        <header className="flex flex-col gap-5">
            <SearchInput onSubmit={searchHandler} searchValue={filterServicesQueries.search || ""} />
            <h1 className="text-[1.7rem] leading-9 font-semibold text-slate-900">
                {filterServicesQueries.search ?
                    `Results for "${filterServicesQueries.search}"`
                    :
                    "Browse services"
                }
            </h1>
            {
                Object.keys(filterServicesQueries).filter(key => key !== "search").length ?
                    <SelectedFilters />
                    :
                    null
            }
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-slate-500 font-medium text-[.95rem]">
                    {props.numOfServices !== 0 && props.numOfServices !== 1 ?
                        `Up to ${props.numOfServices} services available`
                        : `${props.numOfServices} service available`
                    }
                </p>
                <button onClick={openFilterModalHandler} className="flex items-center gap-1 text-slate-700 font-medium bg-purple-100 border py-2 px-3 rounded justify-center">
                    Filter
                    <TbSortDescending size={24} />
                </button>
            </div>
            <FilterServicesModal isModalOpen={isFilterModalOpen} onCloseModal={closeFilterModalHandler} />
        </header>
    )
}

export default SearchServicesHeader