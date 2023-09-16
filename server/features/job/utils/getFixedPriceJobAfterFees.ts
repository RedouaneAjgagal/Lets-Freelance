import { creatingJobFees, completingJobTierOneFees, completingJobTierThreeFees, completingJobTierTwoFees } from "../job.fees";
import { ContractJob } from "../../contract";

type FixedPriceJobAfterFees = {
    contractPrice: ContractJob["price"];
    userAs: "freelancer" | "employer";
}

const getFixedPriceJobAfterFees = ({ contractPrice, userAs }: FixedPriceJobAfterFees) => {
    const calculatedAmountForFreelancer = completingJobTierOneFees.type === "percent" ? (contractPrice / 100) * completingJobTierOneFees.amount : completingJobTierOneFees.amount;
    const calculatedAmountForEmployer = creatingJobFees.type === "percent" ? (contractPrice / 100) * creatingJobFees.amount : creatingJobFees.amount;

    const calculatedAmount = userAs === "employer" ? calculatedAmountForEmployer : calculatedAmountForFreelancer;

    const calculatedUserAmount = userAs === "employer" ? contractPrice + calculatedAmount : contractPrice - calculatedAmount;

    return {
        feeType: userAs === "employer" ? creatingJobFees.type : completingJobTierOneFees.type,
        feeAmount: userAs === "employer" ? creatingJobFees.amount : completingJobTierOneFees.amount,
        calculatedUserAmount
    }
}

export default getFixedPriceJobAfterFees;