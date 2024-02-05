import React, { useState } from 'react'
import SearchInput from '../../../components/SearchInput'
import { TbSortDescending } from 'react-icons/tb';
import FilterServicesModal from '../modals/FilterServicesModal';
import useOverflow from '../../../hooks/useOverflow';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { filterSearchedServicesAction } from '../redux/filterSearchedServices';

const SearchServicesHeader = () => {
    const { search } = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const [searchValue, setSearchValue] = useState<string>("");
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

    const searchHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(filterSearchedServicesAction.filterBySearch(searchValue));
    }

    const searchOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value);
    }

    const openFilterModalHandler = () => {
        setIsFilterModalOpen(true);
    }

    const closeFilterModalHandler = () => {
        setIsFilterModalOpen(false);
    }

    useOverflow(isFilterModalOpen)

    return (
        <header className="flex flex-col gap-3">
            <SearchInput onSubmit={searchHandler} onChange={searchOnChangeHandler} searchValue={searchValue} />
            <h1 className="text-[1.7rem] leading-9 font-semibold text-slate-900">
                {search ?
                    `Results for "${search}"`
                    :
                    "Browse services"
                }
            </h1>
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-slate-600 font-medium">Up to 36 services available</p>
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