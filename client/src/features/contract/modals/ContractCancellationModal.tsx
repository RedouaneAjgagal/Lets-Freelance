import { createPortal } from "react-dom";
import { GetContractCancellationType } from "../services/getContractCancellations";
import Overlay from "../../../layouts/Overlay";
import { TbX } from "react-icons/tb";
import ContractCancellationAboutActivity from "../components/ContractCancellationAboutActivity";
import ContractCancellationRequestedBy from "../components/ContractCancellationRequestedBy";
import CancelContractCta from "../components/CancelContractCta";
import ContractCancellationGeneralInfo from "../components/ContractCancellationGeneralInfo";

type ContractCancellationModalProps = {
    onClose: () => void;
    contractCancellation: GetContractCancellationType;
}

const ContractCancellationModal = (props: React.PropsWithoutRef<ContractCancellationModalProps>) => {

    const activityId = props.contractCancellation.activityType === "job"
        ? props.contractCancellation.job.jobInfo
        : props.contractCancellation.service.serviceInfo;

    const users = ["freelancer", "employer"] as const;

    const cancelRequests = users.map(user => {
        const cancelRequest = props.contractCancellation.cancelRequest[user];
        if (!cancelRequest.isCancelRequest) {
            return null;
        };

        return <ContractCancellationRequestedBy key={user} cancelRequest={cancelRequest} user={user} />;
    });

    return (
        createPortal(
            <>
                <Overlay onClose={props.onClose} />
                <section className="fixed w-[90%] bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded shadow-lg flex flex-col gap-2 min-h-[90%] max-h-[90%] overflow-y-scroll">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-semibold">Contract cancellation</h2>
                        <button onClick={props.onClose} className="p-1">
                            <TbX size={20} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-6">
                        <ContractCancellationGeneralInfo activityId={activityId} activityType={props.contractCancellation.activityType} contractId={props.contractCancellation._id} employer={props.contractCancellation.employer} freelancer={props.contractCancellation.freelancer} />
                        {cancelRequests}
                        <ContractCancellationAboutActivity contract={props.contractCancellation} />
                        <CancelContractCta />
                    </div>
                </section>
            </>
            , document.getElementById("overlay")!
        )
    )
}

export default ContractCancellationModal