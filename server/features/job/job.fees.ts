type JobFees = {
    amount: number;
    type: "percent" | "fixed";
    whoPay: "freelancer" | "employer";
}

type Operator = {
    amount: number;
}

type OperatorTiers = {
    tierOne: Operator;
    tierTwo: Operator;
    tierThree: Operator;
}

const creatingJobFees: JobFees = {
    amount: 3,
    type: "percent",
    whoPay: "employer"
}

const hourlyJobFees: JobFees = {
    amount: 3,
    type: "percent",
    whoPay: "employer"
}

const tierOneFees: JobFees = {
    amount: 20,
    type: "percent",
    whoPay: "freelancer"
}

const tierTwoFees: JobFees = {
    amount: 10,
    type: "percent",
    whoPay: "freelancer"
}

const tierThreeFees: JobFees = {
    amount: 5,
    type: "percent",
    whoPay: "freelancer"
}

const operatorTiers: OperatorTiers = {
    tierOne: {
        amount: 500
    },
    tierTwo: {
        amount: 10000
    },
    tierThree: {
        amount: 10000
    }
}

const jobFees = {
    creatingJobFees,
    hourlyJobFees,
    tierOneFees,
    tierTwoFees,
    tierThreeFees,
    operatorTiers
}

export default jobFees;