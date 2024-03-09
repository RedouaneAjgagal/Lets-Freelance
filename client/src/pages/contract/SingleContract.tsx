import Loading from "../../components/Loading";
import { useContractQuery } from "../../features/contract"


const SingleContract = () => {

    const contractQuery = useContractQuery();

    return (
        <main className="p-4">
            <h1>Contract details</h1>
            {contractQuery.isLoading ?
                <Loading />
                : <p>{contractQuery.data?.activityType}</p>
            }
        </main>
    )
}

export default SingleContract