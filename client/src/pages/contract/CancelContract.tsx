import { useParams } from "react-router-dom";
import { CancelContractForm, useContractQuery } from "../../features/contract"
import { useAppSelector } from "../../hooks/redux";


const CancelContract = () => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const { contractId } = useParams();

    const contractQuery = useContractQuery();

    if (!contractQuery.isLoading && contractQuery.isSuccess) {
        if (contractQuery.data.cancelRequest[userInfo!.userAs]!.isCancelRequest) {
            throw new Error("You have already requested contract cancelation");
        }
    }

    return (
        <main className="p-4 flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Contract cancelation</h1>
            <div className="flex flex-col gap-2">
                <small>Contract ID: {contractId}</small>
                <CancelContractForm />
            </div>
        </main>
    )
}

export default CancelContract