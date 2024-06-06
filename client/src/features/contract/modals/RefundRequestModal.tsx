import { createPortal } from "react-dom";
import { GetRefundRequestContractType } from "../services/getRefundRequests";
import Overlay from "../../../layouts/Overlay";
import { TbX } from "react-icons/tb";
import ContractGeneralInfo from "../components/ContractGeneralInfo";
import AboutActivityContract from "../components/AboutActivityContract";
import RefundRequestDetails from "../components/RefundRequestDetails";

type RefundRequestModalProps = {
    onClose: () => void;
    refundRequestContract: GetRefundRequestContractType;
}

const RefundRequestModal = (props: React.PropsWithoutRef<RefundRequestModalProps>) => {

    const activityId = props.refundRequestContract.activityType === "job"
        ? props.refundRequestContract.job.jobInfo
        : props.refundRequestContract.service.serviceInfo;

    const refundRequests = props.refundRequestContract.payments.filter(payment => payment.employer.refundRequest?.status === "pending");

    return (
        createPortal(
            <>
                <Overlay onClose={props.onClose} />
                <section className="fixed w-[90%] bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded shadow-lg flex flex-col gap-2 min-h-[90%] max-h-[90%] overflow-y-scroll">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold">Refund request</h2>
                        <button onClick={props.onClose} className="p-1">
                            <TbX size={20} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-6">
                        <ContractGeneralInfo createdAt={props.refundRequestContract.createdAt} usersInfo={false} activityId={activityId} activityType={props.refundRequestContract.activityType} contractId={props.refundRequestContract._id} />
                        <article className="flex flex-col gap-2">
                            <h3 className="font-semibold text-lg text-purple-800">
                                Refund Requests
                            </h3>
                            <div className="flex flex-col gap-3">
                                {refundRequests.map(refundRequest => <RefundRequestDetails key={refundRequest._id} refundRequest={refundRequest} onClose={props.onClose} contractId={props.refundRequestContract._id} />)}
                            </div>
                        </article>
                        {props.refundRequestContract.activityType === "job"
                            ? <AboutActivityContract contract={{
                                activityType: "job",
                                job: props.refundRequestContract.job
                            }} />
                            : <AboutActivityContract contract={{
                                activityType: "service",
                                service: props.refundRequestContract.service
                            }} />
                        }
                    </div>
                </section>
            </>
            , document.getElementById("overlay")!
        )
    )
}

export default RefundRequestModal