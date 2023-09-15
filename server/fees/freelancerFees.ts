type Fees = {
    amount: number,
    type: "percent" | "fixed"
}

const serviceFees: Fees = {
    amount: 10,
    type: "percent"
}

const completingJobTierOneFees: Fees = {
    amount: 20,
    type: "percent"
}

const completingJobTierTwoFees: Fees = {
    amount: 10,
    type: "percent"
}

const completingJobTierThreeFees: Fees = {
    amount: 5,
    type: "percent"
}

export {
    serviceFees,
    completingJobTierOneFees,
    completingJobTierTwoFees,
    completingJobTierThreeFees
}