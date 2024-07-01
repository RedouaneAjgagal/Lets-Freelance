
import Loading from "../../components/Loading";
import { useContractQuery, ContractContainer } from "../../features/contract"


const SingleContract = () => {

    const contractQuery = useContractQuery();

    return (
        <main className="p-4 flex flex-col gap-4">
            <h1 className="font-semibold text-2xl text-slate-800">Contract details</h1>
            {contractQuery.isLoading ?
                <Loading />
                : <ContractContainer contract={contractQuery.data!} />
            }
        </main>
    )
}

export default SingleContract