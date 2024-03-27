import { Link } from "react-router-dom";
import { GetPaymentMethodsResponse } from "../services/getPaymentMethods"
import PaymentMethod from "./PaymentMethod";

type PaymentMethodsContainerProps = {
  paymentMethods: GetPaymentMethodsResponse;
}

const PaymentMethodsContainer = (props: React.PropsWithoutRef<PaymentMethodsContainerProps>) => {
  return (
    <section className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {props.paymentMethods.map(paymentMethod => (
          <li key={paymentMethod.id}>
            <PaymentMethod paymentMethod={paymentMethod} />
          </li>
        ))}
      </ul>
      <Link className="flex justify-center border-2 border-slate-600 font-semibold py-1 rounded bg-amber-500" to={"/"}>ADD NEW ONE</Link>
    </section>
  )
}

export default PaymentMethodsContainer