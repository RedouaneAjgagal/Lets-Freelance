import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { TrendingServiceType } from "../../features/service/services/getTrendingServices";

interface Props {
    serviceInfo: TrendingServiceType
}

const TrendingService = (props: React.PropsWithoutRef<Props>) => {
    const navigate = useNavigate();
    const onService = () => {
        navigate(`/services/${props.serviceInfo.service._id}`);
    }

    const reviews = props.serviceInfo.service.rating.numOfReviews === 1 ? `(${props.serviceInfo.service.rating.numOfReviews} Review)` : `(${props.serviceInfo.service.rating.numOfReviews} Reviews)`;

    return (
        <div className="pb-10">
            <button onClick={onService} className="text-left border rounded">
                <div>
                    <img src={props.serviceInfo.service.featuredImage} className="rounded-t w-full max-w-full min-h-full h-64 object-cover group-hover:scale-125 duration-500" />
                </div>
                <div className="px-3 py-4 flex flex-col gap-2">
                    <span className="text-slate-500 hover:text-slate-900 duration-200 text-sm self-start">{props.serviceInfo.service.category}</span>
                    <h3 className="text-black font-semibold text-lg">{props.serviceInfo.service.title}</h3>
                    <div className="flex items-center gap-2 text-sm">
                        {
                            props.serviceInfo.service.rating.avgRate ?
                                <>
                                    <AiFillStar className="text-yellow-500" />
                                    <span className="font-semibold text-black">{props.serviceInfo.service.rating.avgRate || 0}</span>
                                    <span className="text-slate-500">{reviews}</span>
                                </>
                                :
                                null
                        }
                    </div>
                </div>
                <div className="px-3">
                    <div className="border-t flex items-center justify-between gap-2 flex-wrap py-4">
                        <Link to={`/profiles/${props.serviceInfo.profile._id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-sm hover:text-purple-800">
                            <img src={props.serviceInfo.profile.avatar} alt="user image" className="w-8 h-8 object-cover rounded-full" />
                            <span>{props.serviceInfo.profile.name}</span>
                        </Link>
                        <div className="text-sm text-slate-600">
                            <p>Starting at: <span className="text-lg text-black font-medium">${props.serviceInfo.service.tier.starter.price}</span></p>
                        </div>
                    </div>
                </div>
            </button>
        </div>
    )
}

export default TrendingService