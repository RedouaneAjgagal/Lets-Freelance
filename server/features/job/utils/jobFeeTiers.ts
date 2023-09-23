import jobFees from "../job.fees"
import getNetAmountAfterFees from "./getNetAmountAfterFees";

const getHourlyJobFeeTier = ({ paymentAmount, totalPaidAmount }: { paymentAmount: number; totalPaidAmount: number }) => {
    const fees = jobFees.operatorTiers;
    const getCurrentTotalAmount = paymentAmount + totalPaidAmount;

    // tier three fee
    if (totalPaidAmount >= fees.tierThree.amount) {
        const netAmount = getNetAmountAfterFees({
            feeAction: "subtract",
            feeTier: "tierThreeFees",
            paymentAmount
        });

        return netAmount;
    }
    // tier two fee
    else if (totalPaidAmount < fees.tierTwo.amount && totalPaidAmount >= fees.tierOne.amount) {
        // when payment is just tier two fee
        if (getCurrentTotalAmount < fees.tierTwo.amount) {
            const netAmount = getNetAmountAfterFees({
                feeAction: "subtract",
                feeTier: "tierTwoFees",
                paymentAmount
            });

            return netAmount;
        }
        // when payment needs tier two and three fee
        else {
            const tierTwoAmount = fees.tierTwo.amount - totalPaidAmount;
            const tierTwoNetAmount = getNetAmountAfterFees({
                feeAction: "subtract",
                feeTier: "tierTwoFees",
                paymentAmount: tierTwoAmount
            });

            const tierThreeAmount = paymentAmount - tierTwoAmount;
            const tierThreeNetAmount = getNetAmountAfterFees({
                feeAction: "subtract",
                feeTier: "tierThreeFees",
                paymentAmount: tierThreeAmount
            });

            const netAmount = tierTwoNetAmount + tierThreeNetAmount;
            return netAmount;
        }
    }
    // when still in iter one fee
    else {
        if (getCurrentTotalAmount < fees.tierOne.amount) {
            const netAmount = getNetAmountAfterFees({
                feeAction: "subtract",
                feeTier: "tierOneFees",
                paymentAmount
            });

            return netAmount;
        }
        // when payment needs tier one and two fee
        else {
            const tierOneAmount = fees.tierOne.amount - totalPaidAmount;
            const tierOneNetAmount = getNetAmountAfterFees({
                feeAction: "subtract",
                feeTier: "tierOneFees",
                paymentAmount: tierOneAmount
            });

            const tierTwoAmount = paymentAmount - tierOneAmount;
            const tierTwoNetAmount = getNetAmountAfterFees({
                feeAction: "subtract",
                feeTier: "tierTwoFees",
                paymentAmount: tierTwoAmount
            });

            const netAmount = tierOneNetAmount + tierTwoNetAmount;
            return netAmount;
        }
    }
}



const getFixedJobFeeTier = ({ amount }: { amount: number }) => {
    const feeTier = jobFees.operatorTiers;

    let tierOneAmount = amount - feeTier.tierOne.amount;
    let tierTwoAmount = amount - feeTier.tierTwo.amount;

    // when the amount is up to tier three fee
    if (tierOneAmount > 0 && tierTwoAmount > 0) {
        const netAmountTierOne = getNetAmountAfterFees({
            feeAction: "subtract",
            feeTier: "tierOneFees",
            paymentAmount: feeTier.tierOne.amount
        });

        const netAmountTierTwo = getNetAmountAfterFees({
            feeAction: "subtract",
            feeTier: "tierTwoFees",
            paymentAmount: feeTier.tierTwo.amount
        });

        const netAmountTierThree = getNetAmountAfterFees({
            feeAction: "subtract",
            feeTier: "tierThreeFees",
            paymentAmount: amount - feeTier.tierTwo.amount - feeTier.tierOne.amount
        });

        return netAmountTierOne + netAmountTierTwo + netAmountTierThree;

    }
    // when the amount is up to tier two fee
    else if (tierOneAmount > 0 && tierTwoAmount <= 0) {
        const netAmountTierOne = getNetAmountAfterFees({
            feeAction: "subtract",
            feeTier: "tierOneFees",
            paymentAmount: feeTier.tierOne.amount
        });

        const netAmountTierTwo = getNetAmountAfterFees({
            feeAction: "subtract",
            feeTier: "tierTwoFees",
            paymentAmount: amount - feeTier.tierOne.amount
        });

        return netAmountTierOne + netAmountTierTwo;

    }
    // when the amount is only tier one fee
    else {
        const netAmountTierOne = getNetAmountAfterFees({
            feeAction: "subtract",
            feeTier: "tierOneFees",
            paymentAmount: amount
        });

        return netAmountTierOne;
    }
}

const jobFeeTiers = {
    getHourlyJobFeeTier,
    getFixedJobFeeTier
}

export default jobFeeTiers;