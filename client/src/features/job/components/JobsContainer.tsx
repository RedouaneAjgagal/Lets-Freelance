import { JobType } from "../service/getJobs";
import SearchedJobs from "./SearchedJobs";

type JobsContainerProps = {
    jobs: JobType[];
}

const JobsContainer = (props: React.PropsWithoutRef<JobsContainerProps>) => {
    return (
        <div>
            <SearchedJobs jobs={props.jobs} />
        </div>
    )
}

export default JobsContainer