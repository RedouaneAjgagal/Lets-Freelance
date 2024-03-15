import useRefundContractPaymentMutation from "../hooks/useRefundContractPaymentMutation"
import ContractForm from "./ContractForm"

type RefundRequestFormProps = {
    paymentId: string;
}

const RefundRequestForm = (props: React.PropsWithoutRef<RefundRequestFormProps>) => {
    const refundContractPaymentMutation = useRefundContractPaymentMutation();

    return (
        <ContractForm type="refund_payment" contractMutation={refundContractPaymentMutation} paymentId={props.paymentId} />
    )
}

export default RefundRequestForm