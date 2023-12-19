const transferToStripeAmount = (amount: number) => {
    const validStripeAmount = Number(amount.toFixed(2));
    return validStripeAmount * 100;
}

export const transferToStripeDecimalAmount = (amount: number) => {
    const transferredAmount = transferToStripeAmount(amount);
    return transferredAmount.toFixed(2);
}

export default transferToStripeAmount;