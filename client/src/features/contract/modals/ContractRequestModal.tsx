import { createPortal } from "react-dom"
import Overlay from "../../../layouts/Overlay"
import CancelContractStatus from "../../../components/CancelContractStatus";
import { ContractEmployerRefundRequest } from "../services/getUserSingleContract";
import { TbX } from "react-icons/tb";
import formatDate from "../../../utils/formatDate";

type ContractRequestModalProps = {
    onClose: () => void;
    refundRequest: ContractEmployerRefundRequest;
}

const ContractRequestModal = (props: React.PropsWithoutRef<ContractRequestModalProps>) => {
    return (
        createPortal(
            <>
                <Overlay onClose={props.onClose} />
                <section className="fixed w-[90%] bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded shadow-lg flex flex-col gap-2 max-h-[80%] max-w-[45rem]">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold">Refund request</h2>
                        <button onClick={props.onClose} className="p-1"><TbX size={20} /></button>
                    </div>
                    <h3 className="font-medium">Subject:</h3>
                    <div className="bg-slate-100 text-slate-600 p-3 rounded min-h-[6rem] max-h-[8rem] overflow-y-scroll mb-2">
                        <p>{props.refundRequest.subject}</p>
                    </div>
                    <h3 className="font-medium">Reason:</h3>
                    <div className="p-3 bg-slate-100 rounded max-h-[24rem] overflow-y-scroll text-slate-600">
                        <p>{props.refundRequest.reason}</p>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                        <h3 className="font-medium">Requested At:</h3>
                        <small>{formatDate(props.refundRequest.requestedAt)}</small>
                    </div>
                    <div className="mt-2">
                        <CancelContractStatus status={props.refundRequest.status} />
                    </div>
                </section>

            </>
            , document.getElementById("overlay")!
        )
    )
}

export default ContractRequestModal