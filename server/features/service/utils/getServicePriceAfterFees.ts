import { ServicePlan } from "../service.model";
import serviceFees from "../service.fees";

const getServicePriceAfterFees = ({ servicePrice }: { servicePrice: ServicePlan["price"] }) => {
    const calculatedAmount = serviceFees.type === "percent" ? (servicePrice / 100) * serviceFees.amount : serviceFees.amount;
    const freelancerReceiveAmount = servicePrice - calculatedAmount;
    return {
        feeType: serviceFees.type,
        feeAmount: serviceFees.amount,
        freelancerReceiveAmount,
    };
}

export default getServicePriceAfterFees;