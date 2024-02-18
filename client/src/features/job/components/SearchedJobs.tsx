import { JobCard } from "..";
import { JobType } from "../service/getJobs";

type SearchedJobsProps = {
    jobs: JobType[];
}

const SearchedJobs = (props: React.PropsWithoutRef<SearchedJobsProps>) => {
    return (
        <section>
            {props.jobs.map(job => <JobCard key={job._id} job={job} hideFavoriteButton />)}
        </section>
    )
}

export default SearchedJobs