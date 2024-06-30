import Loading from "../../components/Loading";
import { ContractCancellationsContainer, useGetContractCancellationsQuery } from "../../features/contract"


const ContractCancellations = () => {

  const getContractCancellationsQuery = useGetContractCancellationsQuery();

  return (
    <main className="p-4 bg-purple-100/30 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-purple-800 leading-relaxed">Contract Cancellations</h1>
      {getContractCancellationsQuery.isLoading ?
        <Loading type="table" />
        : <ContractCancellationsContainer contracts={getContractCancellationsQuery.data!} />
      }
    </main>
  )
}

export default ContractCancellations