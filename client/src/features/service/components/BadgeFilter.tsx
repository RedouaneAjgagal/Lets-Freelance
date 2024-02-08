import Badge from "../../../layouts/brand/Badge"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { filterSearchedServicesAction } from "../redux/filterSearchedServices";


const BadgeFilter = () => {
    const { badge } = useAppSelector(state => state.filterSearchedServicesReducer);
    const dispatch = useAppDispatch();

    const badges = ["any-talent", "top-rated-plus", "top-rated", "rising-talent"] as const;

    const badgeFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const badge = e.currentTarget.value as "any-talent" | "top-rated-plus" | "top-rated" | "rising-talent";

        if (!badges.includes(badge)) {
            return;
        }

        dispatch(filterSearchedServicesAction.filterByBadge(badge));
    }

    const badgesInputs = badges.map(badgeInput => {

        const badgeLabel = badgeInput.split("-").map(word => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`).join(" ");

        return (
            <label key={badgeInput} htmlFor={badgeInput} className="flex gap-2">
                <input type="radio" id={badgeInput} name="badgeInput" value={badgeInput} className="accent-purple-600" onChange={badgeFilterHandler} checked={
                    badgeInput === "any-talent" ?
                        !badge
                        : badge === badgeInput
                } />
                {badgeInput !== "any-talent" ?
                    <Badge badge={badgeLabel.toLocaleLowerCase() as "rising talent" | "top rated" | "top rated plus"} size="sm" minimized />
                    :
                    null
                }
                {badgeLabel}
            </label>
        )
    });

    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-black text-xl">Talent Quality</h4>
            <div className="flex flex-col gap-2">
                {badgesInputs}
            </div>
        </div>
    )
}

export default BadgeFilter