import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    jobInfo: {
        _id: string;
        title: string;
        employer: {
            _id: string;
            name: string;
            country?: string;
        };
    };
    tags: string[]
}

const JobItem = (props: React.PropsWithoutRef<Props>) => {
    const navigate = useNavigate();
    const onLastJob = () => {
        navigate(`/jobs/${props.jobInfo._id}`);
    }

    return (
        <li>
            <button onClick={onLastJob} className="border rounded p-4 bg-white flex flex-col gap-4 text-left w-full h-full justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-black font-semibold text-xl">{props.jobInfo.title}</h3>
                    <span className="text-purple-600 font-semibold text-sm self-start">{props.jobInfo.employer.name}</span>
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