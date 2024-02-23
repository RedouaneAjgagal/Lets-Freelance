import Loading from "../../components/Loading";
import { useGetSingleJobQuery } from "../../features/job"

const SingleJob = () => {

    const singleJobQuery = useGetSingleJobQuery();

    return (
        <main>
            {singleJobQuery.isLoading ?
                <Loading />
                : <h1>{singleJobQuery.data!.title}</h1>
            }
        </main>
    )
}

export default SingleJob