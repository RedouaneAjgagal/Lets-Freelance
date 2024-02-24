import Loading from "../../components/Loading";
import { SingleJobContainer, useGetSingleJobQuery } from "../../features/job"

const SingleJob = () => {
    const singleJobQuery = useGetSingleJobQuery();

    return (
        <main className="p-4">
            {singleJobQuery.isLoading ?
                <Loading />
                : <SingleJobContainer jobDetails={singleJobQuery.data!} />
            }
        </main>
    )
}

export default SingleJob