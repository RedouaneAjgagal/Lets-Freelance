import useCancelContractMutation from "../hooks/useCancelContractMutation"
import ContractForm from "./ContractForm"


const CancelContractForm = () => {
    const cancelContractMutation = useCancelContractMutation();

    return (
        <ContractForm type="cancel_contract" contractMutation={cancelContractMutation} />
    )
}

export default CancelContractForm