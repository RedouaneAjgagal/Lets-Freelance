import Loading from "../../components/Loading";
import { JobsContainer, useGetJobsQuery, JobsHeader, SearchedJobsPagination } from "../../features/job";
import NoMatchErrorMessage from "../../components/NoMatchErrorMessage";
import FilterJobsMenu from "../../features/job/components/FilterJobsMenu";

const AllJobs = () => {
    const getJobsQuery = useGetJobsQuery();

    return (
        <main className="flex flex-col">
            <JobsHeader />
            <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="hidden lg:flex lg:col-span-4 xl:col-span-3">
                    <FilterJobsMenu key={1} isDesktopLayout />
                </div>
                <div className="col-span-1 lg:col-span-8 xl:col-span-9">
                    {getJobsQuery.isLoading
                        ? <div className="p-4">
                            <Loading type="cards" display="column" numOfCards={4} />
                        </div>
                        : getJobsQuery.isSuccess
                            ? <div>
                                <JobsContainer jobs={getJobsQuery.data.jobs} />
                                <SearchedJobsPagination numbOfPages={getJobsQuery.data.numOfPages} />
                            </div>
                            : <NoMatchErrorMessage />
                    }
                </div>
            </div>
        </main>
    )
}

export default AllJobs