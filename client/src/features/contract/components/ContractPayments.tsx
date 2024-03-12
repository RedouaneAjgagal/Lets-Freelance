import TableHead from "../../../components/TableHead";
import { useAppSelector } from "../../../hooks/redux";
import { ContractPayment } from "../services/getUserSingleContract";
import ContractPaymentTableBody from "./ContractPaymentTableBody";

type ContractPaymentsProps = {
    payments: ContractPayment[];
    priceType: "hourly" | "fixed";
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
                <TableHead width="wider" tableHeads={tableHeads} />
                <tbody>
                    {props.payments.map(payment => <ContractPaymentTableBody priceType={props.priceType} key={payment._id} payment={payment} />)}
                </tbody>
            </table>
        </div>
    )
}

export default ContractPayments