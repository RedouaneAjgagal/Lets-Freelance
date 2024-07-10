import Badge from "../layouts/brand/Badge";

type BadgeFilter = {
    badge?: "any-talent" | "top-rated-plus" | "top-rated" | "rising-talent";
    onSelectBadge: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BadgeFilter = (props: React.PropsWithoutRef<BadgeFilter>) => {
    const badges = ["any-talent", "top-rated-plus", "top-rated", "rising-talent"] as const;

    const badgesInputs = badges.map(badgeInput => {

        const badgeLabel = badgeInput.split("-").map(word => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`).join(" ");

        return (
            <label key={badgeInput} htmlFor={badgeInput} className="flex gap-2">
                <input type="radio" id={badgeInput} name="badgeInput" value={badgeInput} className="accent-purple-600" onChange={props.onSelectBadge} checked={
                    badgeInput === "any-talent" ?
                        !props.badge
                        : props.badge === badgeInput
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
            <h4 className="text-black text-xl lg:font-semibold">Talent Quality</h4>
            <div className="flex flex-col gap-2">
                {badgesInputs}
            </div>
        </div>
    )
}

export default BadgeFilter