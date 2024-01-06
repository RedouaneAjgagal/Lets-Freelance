import { ProfileStatementsPaymentType } from "../services/getProfileStatements"
import StatementPayments from "./StatementPayments"

type StatementPaymentsPropos = {
    payments: ProfileStatementsPaymentType[];
}

const StatementsPayments = (props: React.PropsWithoutRef<StatementPaymentsPropos>) => {
    return (
        <section className='mt-6 flex flex-col gap-4'>
            <h2 className="text-xl text-slate-800 font-semibold">Recent Payments</h2>
            {
                props.payments.length ?
                    <StatementPayments payments={props.payments} />
                    :
                    <h3 className="text-slate-500 mb-2">You have no payments yet..</h3>
            }
        </section>
    )
}

export default StatementsPayments