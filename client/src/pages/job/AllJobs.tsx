import Loading from "../../components/Loading";
import { JobsContainer, useGetJobsQuery } from "../../features/job";


const AllJobs = () => {
    const getJobsQuery = useGetJobsQuery();

    return (
        <main className=" flex flex-col">
            {getJobsQuery.isLoading ?
                <Loading />
                : <JobsContainer jobs={getJobsQuery.data!.jobs} />
            }
        </main>
    )
}

export default AllJobs