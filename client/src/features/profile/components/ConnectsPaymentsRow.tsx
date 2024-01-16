import { TbCalendar } from "react-icons/tb"
import PaymentsStatus from "../../../components/PaymentsStatus"
import { ConnectPaymentType } from "../services/getProfileInfo"

type ConnectsPaymentsRowProps = {
  payment: ConnectPaymentType
}

const ConnectsPaymentsRow = (props: React.PropsWithoutRef<ConnectsPaymentsRowProps>) => {

  const amountPaid = props.payment.amountPaid ?
    `$${props.payment.amountPaid.toFixed(2)}`
    : "--";

  const paidAt = props.payment.paidAt ?
    new Date(props.payment.paidAt).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "short",
      day: "2-digit"
    })
    : "--";

  return (
    <tr className="border-t">
      <td className="p-2 py-4 font-medium">{props.payment.connectionsCount}</td>
      <td className="p-2 py-4">
        <div className="flex">
          <PaymentsStatus type={props.payment.status} />
        </div>
      </td>
      <td className="p-2 py-4 font-medium text-lg">{amountPaid}</td>
      <td className="p-2 py-4 ">{
        props.payment.status === "paid" ?
          <div className="flex items-center gap-2 text-slate-600">
            <TbCalendar size={18} />
            <span>{paidAt}</span>
          </div>
          : <span>{paidAt}</span>
      }
      </td>
    </tr>
  )
}

export default ConnectsPaymentsRow