import jobFees from "../job.fees";
import { ContractJob } from "../../contract";

const getHourlyPriceJobAfterFees = ({ contractHourlyPrice, workedHours }: { contractHourlyPrice: ContractJob["price"]; workedHours: number }) => {
    const totalPrice = contractHourlyPrice * workedHours;
    const calculatedAmount = jobFees.tierOneFees.type === "percent" ? (totalPrice / 100) * jobFees.tierOneFees.amount : jobFees.tierOneFees.amount;
    const freelancerReceiveAmount = totalPrice - calculatedAmount;
    return {
        feeType: jobFees.tierOneFees.type,
        feeAmount: jobFees.tierOneFees.amount,
        freelancerReceiveAmount
    }
}

export default getHourlyPriceJobAfterFees;