import { Link } from "react-router-dom";
import { GetPaymentMethodsResponse } from "../services/getPaymentMethods"
import PaymentMethod from "./PaymentMethod";
import AdverisementPrimaryLink from "./AdverisementPrimaryLink";

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
      <AdverisementPrimaryLink to="/profile/freelancer/advertisements/payment-methods/create" fullWidth>
        ADD NEW ONE
      </AdverisementPrimaryLink>
    </section>
  )
}

export default PaymentMethodsContainer