import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
    jobInfo: {
        _id: string;
        title: string;
        employer: {
            logo?: string;
            name: string;
        };
    };
    tags: string[]
}

const JobItem = (props: React.PropsWithoutRef<Props>) => {
    const navigate = useNavigate();
    const onLastJob = () => {
        navigate("/");
    }

    return (
        <li>
            <button onClick={onLastJob} className="border rounded p-4 bg-white flex flex-col gap-4 text-left w-full h-full">
                {props.jobInfo.employer.logo ?
                    <div>
                        <img src={props.jobInfo.employer.logo} alt="employer logo" className="w-14 max-w-full rounded-full object-cover" />
                    </div>
                    :
                    null
                }
                <div className="flex flex-col gap-1">
                    <h3 className="text-black font-semibold text-xl">{props.jobInfo.title}</h3>
                    <Link to={"/"} className="text-purple-600 font-semibold text-sm self-start">{props.jobInfo.employer.name}</Link>
                </div>
                <div className="flex text-sm text-slate-500 flex-wrap gap-x-2 gap-y-2">
                    {props.tags.map((tag, index) =>
                        <React.Fragment key={index}>
                            <div>
                                <p>{tag}</p>
                            </div>
                            <hr className="border-l-2 h-5 border-slate-200/80 last:hidden" />
                        </React.Fragment>
                    )}
                </div>
            </button>
        </li>
    )
}

export default JobItem