import Loading from "../../components/Loading";
import { JobsContainer, useGetJobsQuery, JobsHeader, SearchedJobsPagination } from "../../features/job";

const AllJobs = () => {
    const getJobsQuery = useGetJobsQuery();

    return (
        <main className=" flex flex-col">
            <JobsHeader />
            {getJobsQuery.isLoading ?
                <Loading />
                :
                <>
                    <JobsContainer jobs={getJobsQuery.data!.jobs} />
                    <SearchedJobsPagination numbOfPages={getJobsQuery.data!.numOfPages} />
                </>
            }
        </main>
    )
}

export default AllJobs