import TableHead from "../../../components/TableHead";
import { useAppSelector } from "../../../hooks/redux";
import { ContractPayment } from "../services/getUserSingleContract";
import ContractPaymentTableBody from "./ContractPaymentTableBody";

type ContractPaymentsProps = {
    payments: ContractPayment[];
    priceType: "hourly" | "fixed";
    contractId: string
}

const ContractPayments = (props: React.PropsWithoutRef<ContractPaymentsProps>) => {
    const { userInfo } = useAppSelector(state => state.authReducer);

    const otherUser = userInfo!.userAs === "employer" ? "Freelancer Status" : "Client Status";

    const tableHeads = ["Amount", "Net Amount", "My Status", otherUser];
    if (userInfo!.userAs === "employer") {
        tableHeads.push("Actions");
    }

    return (
        <div className="bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2">
            <table className="w-full text-left">
                <TableHead width="relaxed" tableHeads={tableHeads} />
                <tbody>
                    {props.payments.map(payment => <ContractPaymentTableBody key={payment._id} priceType={props.priceType} payment={payment} contractId={props.contractId} />)}
                </tbody>
            </table>
        </div>
    )
}

export default ContractPayments