import { Link } from "react-router-dom";
import { SingleServiceType } from "../services/getSingleService"
import formatProfileName from "../../../utils/formatProfileName";
import Badge from "../../../layouts/brand/Badge";
import { TbStarFilled } from "react-icons/tb"

type SingleServiceHeaderProps = {
    title: SingleServiceType["title"];
    profile: {
        _id: SingleServiceType["profile"]["_id"];
        name: SingleServiceType["profile"]["name"];
        avatar: SingleServiceType["profile"]["avatar"];
        rating: SingleServiceType["profile"]["rating"];
        badge: SingleServiceType["profile"]["roles"]["freelancer"]["badge"];
    };
}

const SingleServiceHeader = (props: React.PropsWithoutRef<SingleServiceHeaderProps>) => {

    const freelancerName = formatProfileName(props.profile.name);

    return (
        <article className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl lg:font-medium">{props.title}</h1>
            <section className="flex justify-between items-center gap-2 md:justify-start md:gap-6">
                <Link to={`/profiles/${props.profile._id}`} className="flex items-center gap-2">
                    <div className="relative">
                        <img src={props.profile.avatar} alt="freelancer's avatar" className="w-10 h-10 object-cover rounded-full" />
                        {props.profile.badge === "none" ?
                            null
                            :
                            <div className="absolute -bottom-1 -right-1 md:hidden">
                                <Badge badge={props.profile.badge} size="sm" minimized />
                            </div>
                        }
                    </div>
                    <span>{freelancerName}</span>
                </Link>
                {props.profile.rating.avgRate ?
                    <div className="flex items-center gap-1 flex-wrap">
                        <TbStarFilled className="text-yellow-500" />
                        <span className="font-medium">{props.profile.rating.avgRate}</span>
                        <span className="text-sm text-slate-600">({props.profile.rating.numOfReviews})</span>
                    </div>
                    :
                    null
                }
                {props.profile.badge !== "none"
                    ? <div className="hidden md:flex">
                        <Badge badge={props.profile.badge} size="lg" />
                    </div>
                    : null
                }
            </section>
        </article >
    )
}

export default SingleServiceHeader