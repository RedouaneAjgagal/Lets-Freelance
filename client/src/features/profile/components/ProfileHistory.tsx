import HistoryTabList from "./HistoryTabList";
import CompletedJob from "./CompletedJob";
import InProgressJob from "./InProgressJob";
import { useState } from "react";
import { ProfileReviewsType } from "../../reviews/services/getProfileReviews";


interface Props {
    completedJobs: ProfileReviewsType["completedReviews"];
    inProgressJobs: ProfileReviewsType["inProgressReviews"];
}

const ProfileHistory = (props: React.PropsWithoutRef<Props>) => {
    const [workHistoryTab, setWorkHistoryTab] = useState<"completedJobs" | "inProgress">(props.completedJobs?.length ? "completedJobs" : "inProgress");

    const displayCompletedJobsHandler = () => {
        setWorkHistoryTab("completedJobs");
    }

    const displayInProgessJobsHandler = () => {
        setWorkHistoryTab("inProgress");
    }

    return (
        <section className="py-4 flex flex-col gap-3">
            <h2 className="font-medium text-2xl">Work History</h2>
            {props.completedJobs?.length === 0 && props.inProgressJobs?.length === 0 ?
                <p className="text-slate-500">Empty..</p>
                :
                <div>
                    <HistoryTabList completedJobs={props.completedJobs?.length} inProgressJobs={props.inProgressJobs?.length} onSwitchToCompletedJobs={displayCompletedJobsHandler} onSwitchToInProgressJobs={displayInProgessJobsHandler} workHistoryTab={workHistoryTab} />
                    <ul className="py-4 flex flex-col gap-5">
                        {workHistoryTab === "completedJobs" && props.completedJobs?.length ?
                            props.completedJobs.map((job, index) => <CompletedJob key={index} jobDetail={job} />)
                            :
                            props.inProgressJobs.map((review, index) => <InProgressJob key={index} jobDetail={review} activityType={review.job ? "job" : "service"} isLastJob={props.inProgressJobs?.length === index + 1} />)
                        }
                    </ul>
                </div>
            }
        </section>
    )
}

export default ProfileHistory