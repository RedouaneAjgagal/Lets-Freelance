import { AiFillStar } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { HighRatedFreelancerType } from "../../features/profile/services/getHighRatedFreelancers";
import Tag from "../Tag";

interface Props {
    freelancerInfo: HighRatedFreelancerType;
}

const HighestRatedFreelancer = (props: React.PropsWithoutRef<Props>) => {
    const navigate = useNavigate();
    const onHighestRatedFreelancer = () => {
        navigate("/");
    }

    const hourlyRate = `$${props.freelancerInfo.roles.freelancer.hourlyRate} / hr`;

    return (
        <div className="pb-10">
            <div className="border rounded p-4 flex flex-col gap-6">
                <div className="w-full flex flex-col gap-4">
                    <div className="flex justify-center">
                        <img src={props.freelancerInfo.avatar} alt="freelancer image" className="max-w-full w-20 rounded-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <h4 className="text-lg font-semibold">{props.freelancerInfo.name}</h4>
                        <p className="text-slate-500 text-sm">{props.freelancerInfo.category}</p>
                        {
                            props.freelancerInfo.rating?.avgRate ?
                                <>
                                    <div className="flex  items-center gap-2">
                                        <AiFillStar className="text-yellow-500" />
                                        <p className="flex items-center gap-1 font-medium">
                                            {props.freelancerInfo.rating.avgRate.toFixed(1)}
                                            <span className="text-slate-500 font-normal text-sm">
                                                ({props.freelancerInfo.rating.numOfReviews} Reviews)
                                            </span>
                                        </p>
                                    </div>
                                </>
                                :
                                null
                        }
                    </div>
                    <div className="flex items-center justify-center gap-2 flex-wrap text-sm font-medium">
                        {props.freelancerInfo.roles.freelancer.skills?.slice(0, 4).map((tag, index) =>
                            <Tag key={index} onClick={onHighestRatedFreelancer} value={tag} />
                        )}
                    </div>
                </div>
                <hr className="border-b-0 w-full" />
                <div className="w-full flex flex-col gap-4">
                    <div className="flex text-left gap-x-14 gap-y-2 flex-wrap">
                        <div className="flex flex-col gap-1">
                            <h5 className="font-medium">Location:</h5>
                            <p className="text-sm">{props.freelancerInfo.country}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h5 className="font-medium">Rate:</h5>
                            <p className="text-sm">{hourlyRate}</p>
                        </div>
                    </div>
                    <Link to={`/profiles/${props.freelancerInfo._id}`} className="flex justify-center items-center gap-2 border border-slate-500 rounded py-3 font-medium">
                        View Profile
                        <BiArrowBack className="rotate-[135deg]" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HighestRatedFreelancer