import CategoryFilter from "../../../components/CategoryFilter";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { filterSearchedServicesAction } from "../redux/filterSearchedServices";

type SearchServicesCategoryFilterProps = {
    SIZE: number;
}

const SearchServicesCategoryFilter = (props: React.PropsWithoutRef<SearchServicesCategoryFilterProps>) => {
    const filterSearchedServices = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const selectCategoryHandler = (category: "all-categories" | "programming-tech" | "design-creative" | "digital-marketing" | "writing-translation" | "video-animation" | "finance-accounting" | "music-audio") => {
        dispatch(filterSearchedServicesAction.filterByCategory(category));
    }

    return <CategoryFilter SIZE={props.SIZE} category={filterSearchedServices.category} onSelectCategory={selectCategoryHandler} />
}

export default SearchServicesCategoryFilter