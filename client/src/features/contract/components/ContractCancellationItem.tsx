import { useState } from "react";
import Status from "../../../components/Status";
import ActionButton from "../../../layouts/brand/ActionButton";
import { GetContractCancellationType } from "../services/getContractCancellations"
import ContractCancellationModal from "../modals/ContractCancellationModal";
import useOverflow from "../../../hooks/useOverflow";

type ContractCancellationItemProps = {
    contract: GetContractCancellationType;
};

const ContractCancellationItem = (props: React.PropsWithoutRef<ContractCancellationItemProps>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const users = ["freelancer", "employer"] as const;

    const contractCancellationModalHandler = () => {
        setIsModalOpen(true);
    };

    const closeModalHandler = () => {
        setIsModalOpen(false);
    }


    useOverflow(isModalOpen);

    return (
        <>
            {isModalOpen
                ? <ContractCancellationModal onClose={closeModalHandler} contractCancellation={props.contract} />
                : null
            }
            <tr className="border-t">
                <td className="p-2 py-4">
                    <div className="flex flex-col">
                        <span className="capitalize text-lg">{props.contract.activityType}</span>
                        <span className="text-sm text-slate-600">{props.contract._id}</span>
                    </div>
                </td>
                <td className="p-2 py-4">
                    <div className="flex flex-col gap-3">
                        {users.map(user => {
                            const cancelRequest = props.contract.cancelRequest[user];
                            if (!cancelRequest.isCancelRequest) return null;
                            return (
                                <div key={user}>
                                    <span className="capitalize text-sm text-slate-600">{user}</span>
                                    <h2 className="font-medium line-clamp-2">{cancelRequest.subject} more data here and there right? and we can even do anyways?</h2>
                                </div>
                            )
                        })}
                    </div>
                </td>
                <td className="p-2 py-4 ">
                    <div className="flex items-center">
                        <Status isLoading={false} type={props.contract.cancelRequest.status} />
                    </div>
                </td>
                <td className="p-2 py-4">
                    <div>
                        <ActionButton type="view" onClick={contractCancellationModalHandler} />
                    </div>
                </td>
            </tr>
        </>
    )
}

export default ContractCancellationItem