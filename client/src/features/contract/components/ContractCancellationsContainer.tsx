import { GetContractCancellationsResponse } from "../services/getContractCancellations"

type ContractCancellationsContainerProps = {
    contracts: GetContractCancellationsResponse;
}

const ContractCancellationsContainer = (props: React.PropsWithoutRef<ContractCancellationsContainerProps>) => {
    return (
        props.contracts.map(contract => (
            <div key={contract._id}>{contract._id}</div>
        ))
    )
}

export default ContractCancellationsContainer