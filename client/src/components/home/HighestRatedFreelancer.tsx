import { AiFillStar } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

interface Props {
    freelancerInfo: {
        _id: string;
        name: string;
        img: string;
        job: string;
        rate: number;
        reviews: number;
        tags: string[];
        location: string;
        hourlyRate: {
            min: number;
            max: number;
        };
    }
}

const HighestRatedFreelancer = (props: React.PropsWithoutRef<Props>) => {
    const navigate = useNavigate();
    const onHighestRatedFreelancer = () => {
        navigate("/");
    }

    const hourlyRate = `$${props.freelancerInfo.hourlyRate.min} - $${props.freelancerInfo.hourlyRate.max} / hr`

    return (
        <div className="pb-10">
            <div className="border rounded p-4 flex flex-col gap-6">
                <div className="w-full flex flex-col gap-4">
                    <div className="flex justify-center">
                        <img src={props.freelancerInfo.img} alt="freelancer image" className="max-w-full w-20 rounded-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <h4 className="text-lg font-semibold">{props.freelancerInfo.name}</h4>
                        <p className="text-slate-500 text-sm">{props.freelancerInfo.job}</p>
                        <div className="flex  items-center gap-2">
                            <AiFillStar className="text-yellow-500" />
                            <p className="flex items-center gap-1 font-medium">
                                {props.freelancerInfo.rate.toFixed(1)}
                                <span className="text-slate-500 font-normal text-sm">
                                    ({props.freelancerInfo.reviews} Reviews)
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 flex-wrap text-sm font-medium">
                        {props.freelancerInfo.tags.map((tag, index) => <button key={index} onClick={onHighestRatedFreelancer} className="bg-purple-100/60 py-1 px-3 rounded-full border">{tag}</button>)}
                    </div>
                </div>
                <hr className="border-b-0 w-full" />
                <div className="w-full flex flex-col gap-4">
                    <div className="flex text-left gap-x-14 gap-y-2 flex-wrap">
                        <div className="flex flex-col gap-1">
                            <h5 className="font-medium">Location:</h5>
                            <p className="text-sm">{props.freelancerInfo.location}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h5 className="font-medium">Rate:</h5>
                            <p className="text-sm">{hourlyRate}</p>
                        </div>
                    </div>
                    <Link to={"/"} className="flex justify-center items-center gap-2 border border-slate-500 rounded py-3 font-medium">
                        View Profile
                        <BiArrowBack className="rotate-[135deg]" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HighestRatedFreelancer