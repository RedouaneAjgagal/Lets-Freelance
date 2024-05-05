import React from 'react'
import CategoryFilter from '../../../components/CategoryFilter'
import useCustomSearchParams from '../../../hooks/useCustomSearchParams';
import { isValidCategory } from '../validators/searchTalentsValidators';
import { useQueryClient } from '@tanstack/react-query';

type Categories = "programming-tech" | "design-creative" | "digital-marketing" | "writing-translation" | "video-animation" | "finance-accounting" | "music-audio";

type SearchTalentCategoryFilterProps = {
    SIZE: number;
}

const SearchTalentCategoryFilter = (props: React.PropsWithoutRef<SearchTalentCategoryFilterProps>) => {
    const queryClient = useQueryClient();
    const customSearchParams = useCustomSearchParams();

    const searchedCategory = customSearchParams.getSearchParams({
        key: "category"
    });

    const selectCategoryHandler = (category: Categories | "all-categories") => {
        customSearchParams.setSearchParams({
            key: "category",
            value: category === "all-categories" ? "" : category
        });

        queryClient.removeQueries({ queryKey: ["talents"] });
    }

    const validCategory = isValidCategory(searchedCategory || "");

    const talentCategory = validCategory ? searchedCategory as Categories : undefined;

    return (
        <CategoryFilter SIZE={props.SIZE} onSelectCategory={selectCategoryHandler} category={talentCategory} />
    )
}

export default SearchTalentCategoryFilter