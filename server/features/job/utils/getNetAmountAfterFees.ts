import jobFees from "../job.fees";

type GetNetAmountAfterFees = {
    feeTier: "tierOneFees" | "tierTwoFees" | "tierThreeFees";
    paymentAmount: number;
    feeAction: "add" | "subtract";
}

const getNetAmountAfterFees = ({ feeTier, feeAction, paymentAmount }: GetNetAmountAfterFees) => {
    const feeAmount = jobFees[feeTier].type === "percent" ? (paymentAmount / 100) * jobFees[feeTier].amount : jobFees[feeTier].amount;
    const netAmountAfterFees = feeAction === "add" ? (paymentAmount + feeAmount) : (paymentAmount - feeAmount);
    return netAmountAfterFees;
}

export default getNetAmountAfterFees;