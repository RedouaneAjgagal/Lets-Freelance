import Loading from "../../components/Loading";
import { ContractCancellationsContainer, useGetContractCancellationsQuery } from "../../features/contract"


const ContractCancellations = () => {

  const getContractCancellationsQuery = useGetContractCancellationsQuery();

  return (
    <main>
      {getContractCancellationsQuery.isLoading ?
        <Loading />
        : <ContractCancellationsContainer contracts={getContractCancellationsQuery.data!} />
      }
    </main>
  )
}

export default ContractCancellations