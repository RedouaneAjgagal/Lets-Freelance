import React from 'react'
import RatingFilter from '../../../components/RatingFilter'
import useCustomSearchParams from '../../../hooks/useCustomSearchParams';
import { isValidRating } from '../validators/searchTalentsValidators';
import { useQueryClient } from '@tanstack/react-query';

type SearchTalentRatingFilterProps = {
    rates: number[];
}

const SearchTalentRatingFilter = (props: React.PropsWithoutRef<SearchTalentRatingFilterProps>) => {
    const queryClient = useQueryClient();
    
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

        queryClient.removeQueries({ queryKey: ["telents"] });
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