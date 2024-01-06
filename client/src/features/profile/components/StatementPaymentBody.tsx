import PaymentsStatus from "../../../components/PaymentsStatus";
import Status from "../../../components/Status";
import { useAppSelector } from "../../../hooks/redux";
import { ProfileStatementsPaymentType } from "../services/getProfileStatements";

type StatementPaymentBodyProps = {
    payment: ProfileStatementsPaymentType;
}

const StatementPaymentBody = (props: React.PropsWithoutRef<StatementPaymentBodyProps>) => {

    const { userInfo } = useAppSelector(state => state.authReducer);

    const dateFormatOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "2-digit"
    };

    const date = new Date(props.payment[userInfo!.userAs].at).toLocaleDateString("en-US", dateFormatOptions);

    const type = {
        service: "Service",
        job: "Job"
    } as const;

    const priceType = {
        hourly: "hr",
        fixed: "fixed"
    }

    return (
        <tr className="border-t">
            <td className="p-2 py-4 text-slate-600">
                {date}
            </td>
            <td className="p-2 py-4">
                <div className="flex items-start gap-1 flex-wrap">
                    <span className="font-medium text-lg">{type[props.payment.activityType]}</span>
                    <span className="text-slate-600 text-sm">
                        {priceType[props.payment.projectType]}
                    </span>
                </div>
            </td>
            <td className="p-2 py-4 font-medium">
                {`$${props.payment.amount.toFixed(2)}`}
            </td>
            <td className="p-2 py-4 flex">
                <PaymentsStatus type={props.payment[userInfo!.userAs].status} />
            </td>
        </tr>
    )
}

export default StatementPaymentBody