import HistoryTabList from "./HistoryTabList";
import CompletedJob from "./CompletedJob";
import InProgressJob from "./InProgressJob";
import { useState } from "react";


interface Props {
    completedJobs: {
        title: string;
        rate: number;
        startDate: string;
        endDate: string;
        content: string;
    }[];
    inProgressJobs: {
        title: string;
        startDate: string;
    }[];
    historyType: "work" | "contract";
}

const ProfileHistory = (props: React.PropsWithoutRef<Props>) => {
    const title = props.historyType === "work" ? "Work History" : "Contract History";

    const [workHistoryTab, setWorkHistoryTab] = useState<"completedJobs" | "inProgress">(props.completedJobs.length ? "completedJobs" : "inProgress");

    const displayCompletedJobsHandler = () => {
        setWorkHistoryTab("completedJobs");
    }

    const displayInProgessJobsHandler = () => {
        setWorkHistoryTab("inProgress");
    }

    return (
        <section className="py-4 flex flex-col gap-3">
            <h2 className="font-medium text-2xl px-4">{title}</h2>
            {props.completedJobs.length === 0 && props.inProgressJobs.length === 0 ?
                <p className="text-slate-500 px-4">Empty..</p>
                :
                <div>
                    <HistoryTabList historyType={props.historyType} completedJobs={props.completedJobs.length} inProgressJobs={props.inProgressJobs.length} onSwitchToCompletedJobs={displayCompletedJobsHandler} onSwitchToInProgressJobs={displayInProgessJobsHandler} workHistoryTab={workHistoryTab} />
                    <ul className="p-4 flex flex-col gap-5">
                        {workHistoryTab === "completedJobs" && props.completedJobs.length ?
                            props.completedJobs.map((job, index) => <CompletedJob key={index} jobDetail={job} />)
                            :
                            props.inProgressJobs.map((job, index) => <InProgressJob key={index} jobDetail={job} isLastJob={props.inProgressJobs.length === index + 1} />)
                        }
                    </ul>
                </div>
            }
        </section>
    )
}

export default ProfileHistory