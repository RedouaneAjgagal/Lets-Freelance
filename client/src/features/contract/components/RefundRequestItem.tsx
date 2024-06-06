import { useState } from "react";
import Status from "../../../components/Status";
import ActionButton from "../../../layouts/brand/ActionButton";
import { GetRefundRequestContractType } from "../services/getRefundRequests"
import RefundRequestModal from "../modals/RefundRequestModal";

type RefundRequestItemProps = {
    refundRequestContract: GetRefundRequestContractType;
}

const RefundRequestItem = (props: React.PropsWithoutRef<RefundRequestItemProps>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openRefundRequestModalHandler = () => {
        setIsModalOpen(true);
    };

    const closeModalHandler = () => {
        setIsModalOpen(false);
    }

    const totalAmount = props.refundRequestContract.payments
        .filter(payment => payment.employer.refundRequest?.status === "pending")
        .reduce((prevValue, payment) => {
            return payment.amount + prevValue;
        }, 0);

    return (
        <>
            {isModalOpen
                ? <RefundRequestModal onClose={closeModalHandler} refundRequestContract={props.refundRequestContract} />
                : null}
            <tr className="border-t">
                <td className="p-2 py-4">
                    <div className="flex flex-col">
                        <span className="capitalize text-lg">{props.refundRequestContract.activityType}</span>
                        <span className="text-sm text-slate-600">{props.refundRequestContract._id}</span>
                    </div>
                </td>
                <td className="p-2 py-4">
                    <div>
                        <span className="text-lg">{totalAmount
                            ? `$${totalAmount.toFixed(2)}`
                            : "--"
                        }</span>
                    </div>
                </td>
                <td className="p-2 py-4 ">
                    <div className="flex items-center">
                        <Status isLoading={false} type={"pending"} />
                    </div>
                </td>
                <td className="p-2 py-4">
                    <div>
                        <ActionButton type="view" onClick={openRefundRequestModalHandler} />
                    </div>
                </td>
            </tr>
        </>
    )
}

export default RefundRequestItem