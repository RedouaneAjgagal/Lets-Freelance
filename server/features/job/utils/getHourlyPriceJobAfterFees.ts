import { creatingJobFees, completingJobTierOneFees, completingJobTierThreeFees, completingJobTierTwoFees } from "../job.fees";
import { ContractJob } from "../../contract";

const getHourlyPriceJobAfterFees = ({ contractHourlyPrice, workedHours }: { contractHourlyPrice: ContractJob["price"]; workedHours: number }) => {
    const totalPrice = contractHourlyPrice * workedHours;
    const calculatedAmount = completingJobTierOneFees.type === "percent" ? (totalPrice / 100) * completingJobTierOneFees.amount : completingJobTierOneFees.amount;
    const freelancerReceiveAmount = totalPrice - calculatedAmount;
    return {
        feeType: completingJobTierOneFees.type,
        feeAmount: completingJobTierOneFees.amount,
        freelancerReceiveAmount
    }
}

export default getHourlyPriceJobAfterFees;