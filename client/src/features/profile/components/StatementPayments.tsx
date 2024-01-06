import TableHead from "../../../components/TableHead"
import { useAppSelector } from "../../../hooks/redux";
import { ProfileStatementsPaymentType } from "../services/getProfileStatements";
import StatementPaymentBody from "./StatementPaymentBody";

type StatementPaymentPropos = {
    payments: ProfileStatementsPaymentType[];
}

const StatementPayments = (props: React.PropsWithoutRef<StatementPaymentPropos>) => {

    const tableHeads = ["Date", "Type", "Amount", "Status"];

    const { userInfo } = useAppSelector(state => state.authReducer);

    // sort by newest payments
    props.payments.sort((a, b) => (new Date(b[userInfo!.userAs].at)).getTime() - (new Date(a[userInfo!.userAs].at)).getTime());

    return (
        <div className="bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2">
            <table className="text-left w-full">
                <TableHead tableHeads={tableHeads} />
                <tbody>
                    {
                        props.payments.map(payment => <StatementPaymentBody key={payment._id} payment={payment} />)
                    }
                </tbody>
            </table>
        </div>
    )
}

export default StatementPayments