import React from 'react'
import RatingFilter from '../../../components/RatingFilter'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { filterSearchedServicesAction } from '../redux/filterSearchedServices';

type SearchServicesRatingFilter = {
    rates: number[];
}

const SearchServicesRatingFilter = (props: React.PropsWithoutRef<SearchServicesRatingFilter>) => {
    const { rating } = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const ratingFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rate = Number(e.currentTarget.value);

        // check if valid number
        if (Number.isNaN(rate)) {
            return;
        }

        // check if valid rate value
        if (!props.rates.includes(rate) && rate !== 0) {
            return;
        }

        dispatch(filterSearchedServicesAction.filterByRating(rate));
    }

    return (
        <RatingFilter rates={props.rates} onSelectRate={ratingFilterHandler} rating={rating} />
    )
}

export default SearchServicesRatingFilter