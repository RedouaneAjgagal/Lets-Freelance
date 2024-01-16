import TableHead from "../../../components/TableHead";
import { ConnectPaymentType } from "../services/getProfileInfo"
import ConnectsPaymentsRow from "./ConnectsPaymentsRow";

type ConnectsPaymentsProps = {
    payments: ConnectPaymentType[];
}

const ConnectsPayments = (props: React.PropsWithoutRef<ConnectsPaymentsProps>) => {

    const tableHeads = ["Connects", "Status", "Amount Paid", "Paid At"];

    return (
        <div className="mt-6 flex flex-col gap-4">
            <h2 className="text-xl font-medium">Payments history</h2>
            {props.payments.length ?
                <section className="bg-white rounded p-6 shadow-sm overflow-auto flex flex-col gap-2 text-left">
                    <table className="text-left w-full">
                        <TableHead tableHeads={tableHeads} />
                        <tbody>
                            {props.payments.map(payment => <ConnectsPaymentsRow key={payment.sessionId} payment={payment} />)}
                        </tbody>
                    </table>
                </section>
                :
                <p className="text-slate-600">Empty..</p>
        }
        </div>
    )
}

export default ConnectsPayments