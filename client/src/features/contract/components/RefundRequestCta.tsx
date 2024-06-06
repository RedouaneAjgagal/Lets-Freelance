import { TbLoader2 } from "react-icons/tb";
import { PrimaryButton } from "../../../layouts/brand";
import useRefundPaymentRequestMutation from "../hooks/useRefundPaymentRequestMutation";
import { useEffect } from "react";

type RefundRequestCtaProps = {
    onClose: () => void;
    contractId: string;
    paymentId: string;
}

const RefundRequestCta = (props: React.PropsWithoutRef<RefundRequestCtaProps>) => {
    const refundPaymentRequestMutation = useRefundPaymentRequestMutation();

    const refundPaymentHandler = () => {
        if (refundPaymentRequestMutation.isLoading) return;

        refundPaymentRequestMutation.mutate({
            contractId: props.contractId,
            paymentId: props.paymentId,
            status: "approved"
        });
    }

    const rejectRefundHandler = () => {
        if (refundPaymentRequestMutation.isLoading) return;

        refundPaymentRequestMutation.mutate({
            contractId: props.contractId,
            paymentId: props.paymentId,
            status: "rejected"
        });
    }

    useEffect(() => {
        if (refundPaymentRequestMutation.isSuccess) {
            props.onClose();
        }
    }, [refundPaymentRequestMutation.isSuccess]);

    return (
        <div className="flex flex-wrap justify-between gap-3 mt-3">
            <PrimaryButton type="button" onClick={refundPaymentHandler} disabled={refundPaymentRequestMutation.isLoading} fullWith={false} justifyConent="center" style="solid" x="md" y="md" isLoading={refundPaymentRequestMutation.isLoading && refundPaymentRequestMutation.variables?.status === "approved"}>
                Refund Payment
            </PrimaryButton>
            <button disabled={refundPaymentRequestMutation.isLoading} onClick={rejectRefundHandler} className="p-2 font-medium text-red-600 flex items-center justify-center">
                {refundPaymentRequestMutation.isLoading && refundPaymentRequestMutation.variables?.status === "rejected"
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