import { TbLoader2 } from "react-icons/tb";
import { PrimaryButton } from "../../../layouts/brand";

type RefundRequestCtaProps = {
    onClose: () => void;
    contractId: string;
    paymentId: string;
}

const RefundRequestCta = (props: React.PropsWithoutRef<RefundRequestCtaProps>) => {

    const refundPaymentHandler = () => {
        console.log({
            status: "approved",
            contractId: props.contractId,
            paymentId: props.paymentId,
        });
    }

    const rejectRefundHandler = () => {
        console.log({
            status: "rejected",
            contractId: props.contractId,
            paymentId: props.paymentId,
        });
    }

    return (
        <div className="flex flex-wrap justify-between gap-3 mt-3">
            <PrimaryButton type="button" onClick={refundPaymentHandler} disabled={false} fullWith={false} justifyConent="center" style="solid" x="md" y="md" isLoading={false}>
                Refund Payment
            </PrimaryButton>
            <button onClick={rejectRefundHandler} className="p-2 font-medium text-red-600 flex items-center justify-center">
                {false
                    ? <>
                        <span className="invisible flex">
                            Reject Refund
                        </span>
                        <TbLoader2 className="animate-spin absolute" size={20} />
                    </>
                    : "Reject Refund"}
            </button>
        </div>
    )
}

export default RefundRequestCta