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

const connectsPerJob = {
    min: 1,
    max: 16,
    fixedPriceJob: {
        percent: 1.5
    },
    hourlyPriceJob: {
        starterDuration: {
            lowPercent: 5.5,
            midPercent: 6.3,
            highPercent: 8.4
        },
        standardDuration: {
            lowPercent: 7.8,
            midPercent: 8.9,
            highPercent: 10.5
        },
        advancedDuration: {
            lowPercent: 12.3,
            midPercent: 13.5,
            highPercent: 14.5
        }
    }
};

const jobFees = {
    creatingJobFees,
    hourlyJobFees,
    tierOneFees,
    tierTwoFees,
    tierThreeFees,
    operatorTiers,
    connectsPerJob
}

export default jobFees;