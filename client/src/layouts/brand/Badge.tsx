import { TbNorthStar, TbTopologyStar3, TbTopologyStarRing3 } from "react-icons/tb";

type BadgesProps = {
    badge: "rising talent" | "top rated" | "top rated plus";
    minimized?: boolean;
    size: "sm" | "md" | "lg" | "xl";
}

const Badge = (props: React.PropsWithoutRef<BadgesProps>) => {

    const badges = {
        "rising talent": {
            value: "RISING TALENT",
            icon: TbNorthStar,
            color: "bg-green-500"
        },
        "top rated": {
            value: "TOP RATED",
            icon: TbTopologyStar3,
            color: "bg-blue-500"
        },
        "top rated plus": {
            value: "TOP RATED PLUS",
            icon: TbTopologyStarRing3,
            color: "bg-purple-500"
        }
    } as const;

    const badge = badges[props.badge];

    const sizes = {
        "sm": 13,
        "md": 15,
        "lg": 17,
        "xl": 20
    } as const;

    const size = sizes[props.size];

    return (
        <div className="flex items-center gap-1">
            <span className={`${badge.color} flex justify-center items-center p-[.2rem] rounded-md text-white`}>
                <badge.icon size={size} />
            </span>
            {props.minimized ?
                null
                :
                <span className="text-[.75rem] text-black font-medium">{badge.value}</span>
            }
        </div>
    )
}

export default Badge