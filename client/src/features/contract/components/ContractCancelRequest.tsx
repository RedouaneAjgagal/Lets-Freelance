import { useAppSelector } from "../../../hooks/redux";
import { GetUserContractsReponse } from "../services/getUserSingleContract"
import CancelContractStatus from "../../../components/CancelContractStatus";

type ContractCancelRequestProps = {
    cancelRequest: GetUserContractsReponse["cancelRequest"];
    freelancerStatus: GetUserContractsReponse["freelancer"]["status"];
    employerStatus: GetUserContractsReponse["employer"]["status"];
};

const ContractCancelRequest = (props: React.PropsWithoutRef<ContractCancelRequestProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);
    const cancelRequest = props.cancelRequest[userInfo!.userAs]!;

    return (
        <div>
            {cancelRequest.isCancelRequest ?
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="font-medium text-lg">Subject:</h3>
                        <p className="text-slate-600">{cancelRequest.subject}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-medium text-lg">Reason:</h3>
                        <p className="text-slate-600">{cancelRequest.reason}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-medium text-lg">Platform decision:</h3>
                        <CancelContractStatus status={props.cancelRequest.status!} />
                    </div>
                </div>
                : <div className="flex flex-col gap-1">
                    <h3 className="font-medium text-lg">Platform decision:</h3>
                    <CancelContractStatus status={props.cancelRequest.status!} />
                </div>
            }
        </div>
    )
}

export default ContractCancelRequest