type ServiceFees = {
    amount: number;
    type: "percent" | "fixed";
    whoPay: "freelancer" | "employer";
}

const serviceFees: ServiceFees = {
    amount: 15,
    type: "percent",
    whoPay: "freelancer"
}

export default serviceFees;