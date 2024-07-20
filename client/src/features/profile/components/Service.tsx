import { Link, useNavigate } from "react-router-dom";
import { ServiceType } from "../services/getSingleProfileInfo"
import { AiFillStar } from "react-icons/ai";

type Service = {
    profile: {
        _id: string;
        name: string;
        avatar: string;
    };
    serviceInfo: ServiceType;
}

const Service = (props: React.PropsWithoutRef<Service>) => {
    {
        const navigate = useNavigate();
        const onService = () => {
            navigate(`/services/${props.serviceInfo._id}`);
        }

        const reviews = props.serviceInfo.rating.numOfReviews === 1 ? `(${props.serviceInfo.rating.numOfReviews} Review)` : `(${props.serviceInfo.rating.numOfReviews} Reviews)`;

        return (
            <div className="pb-10">
                <button onClick={onService} className="text-left border rounded w-full">
                    <div>
                        <img src={props.serviceInfo.featuredImage} className="rounded-t w-full max-w-full min-h-full h-64 object-cover group-hover:scale-125 duration-500" />
                    </div>
                    <div className="px-3 py-4 flex flex-col gap-2">
                        <Link to={"/category"} className="text-slate-500 hover:text-slate-900 duration-200 text-sm">{props.serviceInfo.category}</Link>
                        <h3 className="text-black font-semibold text-lg">{props.serviceInfo.title}</h3>
                        <div className="flex items-center gap-2 text-sm">
                            {
                                props.serviceInfo.rating.avgRate ?
                                    <>
                                        <AiFillStar className="text-yellow-500" />
                                        <span className="font-semibold text-black">{props.serviceInfo.rating.avgRate || 0}</span>
                                        <span className="text-slate-500">{reviews}</span>
                                    </>
                                    :
                                    null
                            }
                        </div>
                    </div>
                    <div className="px-3">
                        <div className="border-t flex items-center justify-between gap-2 flex-wrap py-4">
                            <div className="flex items-center gap-2 text-sm">
                                <img src={props.profile.avatar} alt="user image" className="w-8 h-8 object-cover rounded-full" />
                                <span>{props.profile.name}</span>
                            </div>
                            <div className="text-sm text-slate-600">
                                <p>Starting at: <span className="text-lg text-black font-medium">${props.serviceInfo.tier.starter.price}</span></p>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        )
    }
}

export default Service