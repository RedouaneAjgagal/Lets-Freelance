import { Link, useNavigate } from "react-router-dom";

interface Props {
    latestJobInfo: {
        id: string;
        title: string;
        location: string;
        postedAt: string;
        porposals: string[];
        employer: {
            logo: string;
            name: string;
        };
    }
}

const LatestJob = (props: React.PropsWithoutRef<Props>) => {
    const navigate = useNavigate();
    const onLastJob = () => {
        navigate("/");
    }
    return (
        <li>
            <button onClick={onLastJob} className="border rounded p-4 bg-white flex flex-col gap-4 text-left w-full h-full">
                <div>
                    <img src={props.latestJobInfo.employer.logo} alt="employer logo" className="w-14 max-w-full rounded-full object-cover" />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="text-black font-semibold text-xl">{props.latestJobInfo.title}</h3>
                    <Link to={"/"} className="text-purple-600 font-semibold text-sm self-start">{props.latestJobInfo.employer.name}</Link>
                </div>
                <div className="flex text-sm text-slate-500 flex-wrap gap-x-2 gap-y-2">
                    <div>
                        <p>{props.latestJobInfo.location}</p>
                    </div>
                    <hr className="border-l-2 h-5" />
                    <div>
                        <p>Posted {props.latestJobInfo.postedAt} ago</p>
                    </div>
                    <hr className="border-l-2 h-5" />
                    <div>
                        <p>{props.latestJobInfo.porposals.length} Proposals</p>
                    </div>
                </div>
            </button>
        </li>
    )
}

export default LatestJob