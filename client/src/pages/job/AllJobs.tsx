import Loading from "../../components/Loading";
import { JobsContainer, useGetJobsQuery, JobsHeader } from "../../features/job";

const AllJobs = () => {
    const getJobsQuery = useGetJobsQuery();

    return (
        <main className=" flex flex-col">
            <JobsHeader />
            {getJobsQuery.isLoading ?
                <Loading />
                : <JobsContainer jobs={getJobsQuery.data!.jobs} />
            }
        </main>
    )
}

export default AllJobs