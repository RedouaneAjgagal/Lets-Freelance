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
        <article className="bg-purple-100/30 px-4 py-6 flex flex-col gap-4">
            <h1 className="text-3xl font-semibold">{props.title}</h1>
            <section className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                    <div>
                        <img src={props.profile.avatar} alt="freelancer's avatar" className="w-9 h-9 object-cover rounded-full" />
                    </div>
                    <Link to={`/profiles/${props.profile._id}`} className="">{freelancerName}</Link>
                    {props.profile.badge === "none" ?
                        null
                        :
                        <Badge badge={props.profile.badge} size="sm" minimized />
                    }
                </div>
                {props.profile.rating.avgRate ?
                    <div className="flex items-center gap-1 flex-wrap">
                        <TbStarFilled className="text-yellow-500" />
                        <span className="font-medium">{props.profile.rating.avgRate}</span>
                        <span className="text-sm text-slate-600">({props.profile.rating.numOfReviews})</span>
                    </div>
                    :
                    null
                }
            </section>
        </article >
    )
}

export default SingleServiceHeader