import { ContractPaymentType } from "../services/getRefundRequests";
import RefundRequestCta from "./RefundRequestCta";

type RefundRequestDetailsProps = {
    refundRequest: ContractPaymentType;
    onClose: () => void;
    contractId: string;
}

const RefundRequestDetails = (props: React.PropsWithoutRef<RefundRequestDetailsProps>) => {
    return (
        <div className="p-2 bg-slate-100 rounded flex flex-col gap-1 border">
            <div className="flex flex-col">
                <h5 className="font-medium">Payment ID:</h5>
                <span className="text-slate-600">{props.refundRequest._id}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Amount:</h5>
                <span className="text-slate-600">${props.refundRequest.amount.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Status:</h5>
                <div className="text-slate-600 ">
                    <span className="capitalize">{
                        props.refundRequest.employer.status
                    } </span>
                    <span className="text-sm">({
                        new Date(props.refundRequest.employer.at).toUTCString()
                    })</span>
                </div>
            </div>
            {props.refundRequest.workedHours
                ? <div className="flex flex-col">
                    <h5 className="font-medium">Worked hours:</h5>
                    <span className="text-slate-600">{props.refundRequest.workedHours}h</span>
                </div>
                : null
            }
            <div className="flex flex-col">
                <h5 className="font-medium">Subject:</h5>
                <span className="text-slate-600">{props.refundRequest.employer.refundRequest!.subject}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Reason:</h5>
                <span className="text-slate-600">{props.refundRequest.employer.refundRequest!.reason}</span>
            </div>
            <div className="flex flex-col">
                <h5 className="font-medium">Requested at:</h5>
                <span className="text-slate-600">
                    {
                        new Date(props.refundRequest.employer.refundRequest!.requestedAt).toUTCString()
                    }
                </span>
            </div>
            <RefundRequestCta onClose={props.onClose} contractId={props.contractId} paymentId={props.refundRequest._id} />
        </div>
    )
}

export default RefundRequestDetails