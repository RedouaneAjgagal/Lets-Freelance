import React from 'react'
import RatingFilter from '../../../components/RatingFilter'
import useCustomSearchParams from '../../../hooks/useCustomSearchParams';
import { isValidRating } from '../validators/searchTalentsValidators';

type SearchTalentRatingFilterProps = {
    rates: number[];
}

const SearchTalentRatingFilter = (props: React.PropsWithoutRef<SearchTalentRatingFilterProps>) => {

    const customSearchParams = useCustomSearchParams();

    const rating = customSearchParams.getSearchParams({
        key: "rating"
    });

    const ratingFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rating = e.currentTarget.value;

        customSearchParams.setSearchParams({
            key: "rating",
            value: rating === "0" ? "" : rating
        });
    }

    const validRating = isValidRating({
        validRates: props.rates,
        rating: rating || ""
    });

    const talentRating = validRating ? Number(rating) : undefined;

    return (
        <RatingFilter onSelectRate={ratingFilterHandler} rates={props.rates} rating={talentRating} />
    )
}

export default SearchTalentRatingFilter