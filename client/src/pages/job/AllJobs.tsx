import Loading from "../../components/Loading";
import { JobsContainer, useGetJobsQuery, JobsHeader, SearchedJobsPagination } from "../../features/job";
import NoMatchErrorMessage from "../../components/NoMatchErrorMessage";

const AllJobs = () => {
    const getJobsQuery = useGetJobsQuery();

    return (
        <main className=" flex flex-col">
            <JobsHeader />
            {getJobsQuery.isLoading ?
                <div className="p-4">
                    <Loading type="cards" display="column" />
                </div>
                :
                getJobsQuery.isSuccess ?
                    <>
                        <JobsContainer jobs={getJobsQuery.data.jobs} />
                        <SearchedJobsPagination numbOfPages={getJobsQuery.data.numOfPages} />
                    </>
                    : <NoMatchErrorMessage />
            }
        </main>
    )
}

export default AllJobs