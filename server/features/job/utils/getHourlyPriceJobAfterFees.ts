import jobFees from "../job.fees";
import { ContractJob } from "../../contract";

const getHourlyPriceJobAfterFees = ({ contractHourlyPrice, workedHours }: { contractHourlyPrice: ContractJob["price"]; workedHours: number }) => {
    const totalPrice = contractHourlyPrice * workedHours;
    const calculatedAmount = jobFees.completingJobTierOneFees.type === "percent" ? (totalPrice / 100) * jobFees.completingJobTierOneFees.amount : jobFees.completingJobTierOneFees.amount;
    const freelancerReceiveAmount = totalPrice - calculatedAmount;
    return {
        feeType: jobFees.completingJobTierOneFees.type,
        feeAmount: jobFees.completingJobTierOneFees.amount,
        freelancerReceiveAmount
    }
}

export default getHourlyPriceJobAfterFees;