const transferToStripeAmount = (amount: number) => {
    const validStripeAmount = Number(amount.toFixed(2));
    return validStripeAmount * 100;
}

export default transferToStripeAmount;