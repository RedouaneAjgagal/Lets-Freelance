type JobFees = {
    amount: number;
    type: "percent" | "fixed";
    whoPay: "freelancer" | "employer";
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

const completingJobTierOneFees: JobFees = {
    amount: 20,
    type: "percent",
    whoPay: "freelancer"
}

const completingJobTierTwoFees: JobFees = {
    amount: 10,
    type: "percent",
    whoPay: "freelancer"
}

const completingJobTierThreeFees: JobFees = {
    amount: 5,
    type: "percent",
    whoPay: "freelancer"
}

export {
    creatingJobFees,
    hourlyJobFees,
    completingJobTierOneFees,
    completingJobTierTwoFees,
    completingJobTierThreeFees
};