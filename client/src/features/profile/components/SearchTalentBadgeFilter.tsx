import { useQueryClient } from "@tanstack/react-query";
import BadgeFilter from "../../../components/BadgeFilter"
import useCustomSearchParams from "../../../hooks/useCustomSearchParams";
import { isValidTalentBadge } from "../validators/searchTalentsValidators";

const SearchTalentBadgeFilter = () => {
    const queryClient = useQueryClient();
    const customSearch = useCustomSearchParams();

    const badge = customSearch.getSearchParams({
        key: "badge"
    });

    const filterBadgeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const badge = e.currentTarget.value;
        customSearch.setSearchParams({
            key: "badge",
            value: badge === "any-talent" ? "" : badge
        });

        queryClient.removeQueries({ queryKey: ["talents"] });
    }

    const validTalentBadge = isValidTalentBadge(badge || "");

    const validBadge = validTalentBadge ? badge as "any-talent" | "top-rated-plus" | "top-rated" : undefined;
    return (
        <div>
            <BadgeFilter onSelectBadge={filterBadgeHandler} badge={validBadge} />
        </div>
    )
}

export default SearchTalentBadgeFilter