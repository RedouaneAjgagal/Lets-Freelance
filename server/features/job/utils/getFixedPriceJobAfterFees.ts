import jobFees from "../job.fees";

import { ContractJob } from "../../contract";

type FixedPriceJobAfterFees = {
    contractPrice: ContractJob["price"];
    userAs: "freelancer" | "employer";
}

const getFixedPriceJobAfterFees = ({ contractPrice, userAs }: FixedPriceJobAfterFees) => {
    const calculatedAmountForFreelancer = jobFees.completingJobTierOneFees.type === "percent" ? (contractPrice / 100) * jobFees.completingJobTierOneFees.amount : jobFees.completingJobTierOneFees.amount;
    const calculatedAmountForEmployer = jobFees.creatingJobFees.type === "percent" ? (contractPrice / 100) * jobFees.creatingJobFees.amount : jobFees.creatingJobFees.amount;

    const calculatedAmount = userAs === "employer" ? calculatedAmountForEmployer : calculatedAmountForFreelancer;

    const calculatedUserAmount = userAs === "employer" ? contractPrice + calculatedAmount : contractPrice - calculatedAmount;

    return {
        feeType: userAs === "employer" ? jobFees.creatingJobFees.type : jobFees.completingJobTierOneFees.type,
        feeAmount: userAs === "employer" ? jobFees.creatingJobFees.amount : jobFees.completingJobTierOneFees.amount,
        calculatedUserAmount
    }
}

export default getFixedPriceJobAfterFees;