import { JobType } from "../service/getJobs"
import JobCard from "./JobCard";

type JobsContainerProps = {
    jobs: JobType[];
}

const JobsContainer = (props: React.PropsWithoutRef<JobsContainerProps>) => {
    return (
        <section>
            {props.jobs.map(job => <JobCard key={job._id} job={job} hideFavoriteButton />)}
        </section>
    )
}

export default JobsContainer