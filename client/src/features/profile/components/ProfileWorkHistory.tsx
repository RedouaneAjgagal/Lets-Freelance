import WorkHistoryTabList from "./WorkHistoryTabList";
import CompletedJob from "./CompletedJob";
import InProgressJob from "./InProgressJob";
import { useState } from "react";


interface Props {
    completedJobs: {
        title: string;
        rating: number;
        startDate: string;
        endDate: string;
        content: string;
    }[];
    inProgressJobs: {
        title: string;
        startDate: string;
    }[]
}

const ProfileWorkHistory = (props: React.PropsWithoutRef<Props>) => {

    const [workHistoryTab, setWorkHistoryTab] = useState<"completedJobs" | "inProgress">("completedJobs");

    const displayCompletedJobsHandler = () => {
        setWorkHistoryTab("completedJobs");
    }

    const displayInProgessJobsHandler = () => {
        setWorkHistoryTab("inProgress");
    }

    return (
        <section className="py-4 flex flex-col gap-3">
            <h2 className="font-medium text-2xl px-4">Work History</h2>
            <div>
                <WorkHistoryTabList completedJobs={props.completedJobs.length} inProgressJobs={props.inProgressJobs.length} onSwitchToCompletedJobs={displayCompletedJobsHandler} onSwitchToInProgressJobs={displayInProgessJobsHandler} workHistoryTab={workHistoryTab} />
                <ul className="p-4 flex flex-col gap-5">
                    {workHistoryTab === "completedJobs" ?
                        props.completedJobs.map((job, index) => <CompletedJob key={index} jobDetail={job} />)
                        :
                        props.inProgressJobs.map((job, index) => <InProgressJob key={index} jobDetail={job} isLastJob={props.inProgressJobs.length === index + 1} />)
                    }
                </ul>
            </div>
        </section>
    )
}

export default ProfileWorkHistory