import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Tag from "./Tag";
import formatProfileName from "../utils/formatProfileName";
import FavoriteHeartButton from "./FavoriteHeartButton";
import Badge from "../layouts/brand/Badge";
import useFavoritesMutation from "../features/favorites/hooks/useFavoritesMutation";
import NavigatorLink from "./NavigatorLink";

type Category = "digital marketing" | "design & creative" | "programming & tech" | "writing & translation" | "video & animation" | "finance & accounting" | "music & audio";

type Rating = {
    avgRate: number | undefined;
    numOfReviews: number;
};

type FreelancerCardProps = {
    freelancerInfo: {
        _id: string;
        name: string;
        avatar: string;
        userAs?: "freelancer";
        roles: {
            freelancer: {
                badge: "none" | "rising talent" | "top rated" | "top rated plus";
                jobTitle: string | undefined;
                hourlyRate: number;
                skills: string[];
            }
        };
        category: Category;
        country: string | undefined;
        rating: Rating;
        isFavourite: 0 | 1;
    }
}

const FreelancerCard = (props: React.PropsWithoutRef<FreelancerCardProps>) => {
    const navigate = useNavigate();
    const favoritesMutation = useFavoritesMutation({
        event: "profile",
        target: props.freelancerInfo._id
    });

    const hourlyRate = `$${props.freelancerInfo.roles.freelancer.hourlyRate} / hr`;

    const freelancerName = formatProfileName(props.freelancerInfo.name);

    const tagNavigator = (value: string) => {
        navigate(`/profiles?search=${value}`);
    }

    const favoriteFreelancerToggle = () => {
        favoritesMutation.mutate({
            event: "profile",
            target: props.freelancerInfo._id
        });
    }

    return (
        <article className="border rounded p-4 flex flex-col gap-6 relative">
            <FavoriteHeartButton fillHeart={props.freelancerInfo.isFavourite === 1 ? true : false} onClick={favoriteFreelancerToggle} />
            <div className="w-full flex flex-col items-center gap-4">
                <div className="flex  relative w-16 h-16">
                    <img src={props.freelancerInfo.avatar} alt="freelancer image" className="rounded-full object-cover" />
                    {props.freelancerInfo.roles.freelancer.badge !== "none" ?
                        <span className="absolute bottom-0 right-0">
                            <Badge badge={props.freelancerInfo.roles.freelancer.badge} minimized size="lg" />
                        </span>
                        :
                        null
                    }
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <h4 className="text-lg font-semibold">{freelancerName}</h4>
                    <p className="text-slate-500 text-sm">{props.freelancerInfo.roles.freelancer.jobTitle || props.freelancerInfo.category}</p>
                    {
                        props.freelancerInfo.rating?.avgRate ?
                            <div className="flex  items-center gap-2">
                                <AiFillStar className="text-yellow-500" />
                                <p className="flex items-center gap-1 font-medium">
                                    {props.freelancerInfo.rating.avgRate.toFixed(1)}
                                    <span className="text-slate-500 font-normal text-sm">
                                        ({props.freelancerInfo.rating.numOfReviews} Reviews)
                                    </span>
                                </p>
                            </div>
                            :
                            null
                    }
                </div>
                {props.freelancerInfo.roles.freelancer.skills.length
                    ? <div className="flex items-center justify-center gap-2 flex-wrap text-sm font-medium">
                        {props.freelancerInfo.roles.freelancer.skills.slice(0, 4).map((tag, index) =>
                            <Tag key={index} value={tag} clickable onClick={() => tagNavigator(tag)} />
                        )}
                    </div>
                    : null
                }
            </div>
            <hr className="border-b-0 w-full" />
            <div className="w-full flex flex-col gap-4">
                <div className="flex text-left gap-x-14 gap-y-2 flex-wrap">
                    <div className="flex flex-col gap-1">
                        <h5 className="font-medium">Location:</h5>
                        <p className="text-sm">{props.freelancerInfo.country || "Unknown"}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h5 className="font-medium">Rate:</h5>
                        <p className="text-sm">{hourlyRate}</p>
                    </div>
                </div>
                <NavigatorLink to={`/profiles/${props.freelancerInfo._id}`}>View Profile</NavigatorLink>
            </div>
        </article>
    )
}

export default FreelancerCard