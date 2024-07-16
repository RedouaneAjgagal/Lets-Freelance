import Loading from "../../components/Loading";
import { SingleJobAboutClient, SingleJobContainer, SingleJobProfileHistory, useGetSingleJobQuery } from "../../features/job"
import { SingleJobHeader } from "../../features/message";

const SingleJob = () => {
    const singleJobQuery = useGetSingleJobQuery();

    return (
        <main className="p-4 flex flex-col gap-8 xl:max-w-[95rem] xl:m-auto px-4">
            {singleJobQuery.isLoading ?
                <Loading type="singlePage" />
                :
                <div className="flex flex-col gap-6">
                    <SingleJobHeader status={singleJobQuery.data!.status} title={singleJobQuery.data!.title} category={singleJobQuery.data!.category} createdAt={singleJobQuery.data!.createdAt} jobId={singleJobQuery.data!._id} publisherId={singleJobQuery.data!.profile._id} isFavorited={singleJobQuery.data!.isFavorited} />
                    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-4">
                        <div className="hidden lg:flex lg:order-1 lg:col-span-3 lg:self-start lg:sticky lg:top-4">
                            <SingleJobAboutClient jobStatus={singleJobQuery.data!.status} clientInfo={singleJobQuery.data!.profile} connects={singleJobQuery.data!.connects} jobId={singleJobQuery.data!._id} hasSubmitted={singleJobQuery.data!.hasSubmitted} isFavorited={singleJobQuery.data!.isFavorited} isDesktopLayout />
                        </div>
                        <div className="grid gap-6 grid-cols-1 lg:col-span-9">
                            <div className="flex flex-col gap-5">
                                <SingleJobContainer jobDetails={singleJobQuery.data!} />
                            </div>
                            <SingleJobProfileHistory employerId={singleJobQuery.data!.profile._id} />
                        </div>
                    </div>
                </div>
            }
        </main>
    )
}

export default SingleJob