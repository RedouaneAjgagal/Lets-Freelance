import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface Props {
    serviceInfo: {
        _id: string;
        img: string;
        category: string;
        title: string;
        rate: number;
        reviews: number;
        user: {
            img: string;
            name: string;
        };
        price: number;
    }
}

const TrendingService = (props: React.PropsWithoutRef<Props>) => {
    const navigate = useNavigate();
    const onService = () => {
        navigate("/");
    }

    const reviews = props.serviceInfo.reviews === 1 ? `(${props.serviceInfo.reviews} Review)` : `(${props.serviceInfo.reviews} Reviews)`

    return (
        <div className="pb-10">
            <button onClick={onService} className="text-left border rounded">
                <div>
                    <img src={props.serviceInfo.img} className="rounded-t w-full max-w-full min-h-full h-64 object-cover group-hover:scale-125 duration-500" />
                </div>
                <div className="px-3 py-4 flex flex-col gap-2">
                    <Link to={"/category"} className="text-slate-500 hover:text-slate-900 duration-200 text-sm">{props.serviceInfo.category}</Link>
                    <h3 className="text-black font-semibold text-lg">{props.serviceInfo.title}</h3>
                    <div className="flex items-center gap-2 text-sm">
                        <AiFillStar className="text-yellow-500" />
                        <span className="font-semibold text-black">{props.serviceInfo.rate}</span>
                        <span className="text-slate-500">{reviews}</span>
                    </div>
                </div>
                <div className="px-3">
                    <div className="border-t flex items-center justify-between gap-2 flex-wrap py-4">
                        <Link to={"/user"} className="flex items-center gap-2 text-sm hover:text-purple-800">
                            <img src={props.serviceInfo.user.img} alt="user image" className="w-8 h-8 object-cover rounded-full" />
                            <span>{props.serviceInfo.user.name}</span>
                        </Link>
                        <div className="text-sm text-slate-600">
                            <p>Starting at: <span className="text-lg text-black font-medium">${props.serviceInfo.price}</span></p>
                        </div>
                    </div>
                </div>
            </button>
        </div>
    )
}

export default TrendingService