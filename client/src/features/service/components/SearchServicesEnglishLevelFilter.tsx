import React from 'react'
import EnglishLevelFilter from '../../../components/EnglishLevelFilter';
import { filterSearchedServicesAction } from '../redux/filterSearchedServices';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';

type SearchServicesEnglishLevelFilterProps = {
    SIZE: number;
}

const SearchServicesEnglishLevelFilter = (props: React.PropsWithoutRef<SearchServicesEnglishLevelFilterProps>) => {
    const { english_level } = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const setEnglishLevelHandler = (englishLevel: "Any level" | "professional" | "native" | "fluent" | "conversational" | "basic") => {
        dispatch(filterSearchedServicesAction.filterByEnglishLevel(englishLevel));
    }

    return (
        <EnglishLevelFilter SIZE={props.SIZE} englishLevel={english_level} onSelectEnglishLevel={setEnglishLevelHandler} />
    )
}

export default SearchServicesEnglishLevelFilter