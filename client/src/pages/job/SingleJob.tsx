import Loading from "../../components/Loading";
import { SingleJobContainer, SingleJobProfileHistory, useGetSingleJobQuery } from "../../features/job"

const SingleJob = () => {
    const singleJobQuery = useGetSingleJobQuery();

    return (
        <main className="p-4 flex flex-col gap-8">
            {singleJobQuery.isLoading ?
                <Loading />
                : <>
                    <div className="flex flex-col gap-5">
                        <SingleJobContainer jobDetails={singleJobQuery.data!} />
                    </div>
                    <SingleJobProfileHistory employerId={singleJobQuery.data!.profile._id} />
                </>
            }
        </main>
    )
}

export default SingleJob