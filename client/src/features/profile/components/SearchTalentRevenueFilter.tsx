import BudgetFilter from "../../../components/BudgetFilter"
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { isValidRevenue } from "../validators/searchTalentsValidators";

type SearchTalentRevenueFilterProps = {
    from: number;
    to: number;
    step: number;
}

const SearchTalentRevenueFilter = (props: React.PropsWithoutRef<SearchTalentRevenueFilterProps>) => {
    const customSearchParams = useCustomSearchParams();

    const revenueRange = customSearchParams.getSearchParams({
        key: "revenue"
    });

    const setRevenueHandler = (revenueRange: string) => {
        customSearchParams.setSearchParams({
            key: "revenue",
            value: revenueRange
        });
    }

    const validRevenue = isValidRevenue(revenueRange || "");
    const talentRevenue = validRevenue ? revenueRange! : undefined;

    return (
        <BudgetFilter from={props.from} to={props.to} step={props.step} onChange={setRevenueHandler} title="Revenue" price_range={talentRevenue} />
    )
}

export default SearchTalentRevenueFilter