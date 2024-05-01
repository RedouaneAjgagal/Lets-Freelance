import BudgetFilter from "../../../components/BudgetFilter";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import { filterSearchedServicesAction } from "../redux/filterSearchedServices";

type SearchServicesBudgetFilter = {
    from: number;
    to: number;
    step: number;
}

const SearchServicesBudgetFilter = (props: React.PropsWithoutRef<SearchServicesBudgetFilter>) => {
    const dispatch = useAppDispatch();
    const { price_range } = useAppSelector(state => state.filterSearchedServicesReducer);

    const onChangeBudget = (priceRange: string) => {
        dispatch(filterSearchedServicesAction.filterByPriceRange(priceRange));
    };

    return (
        <BudgetFilter from={props.from} to={props.to} step={props.step} price_range={price_range} onChange={onChangeBudget} title="Budget" />
    )
}

export default SearchServicesBudgetFilter