import sendEmail from "../../../services/sendEmail"

type CompletedJobContractEmailFixedPrice = {
    contractId: string;
    email: string;
    userAs: "freelancer" | "employer";
    price: number;
    feeType: "percent" | "fixed";
    feeAmount: number;
    priceAfterFees: number;
}

type CompletedJobContractEmailHourlyPrice = {
    contractId: string;
    email: string;
    userAs: "freelancer" | "employer";
    price: number;
    feeType: "percent" | "fixed";
    feeAmount: number;
    priceAfterFees: number;
    workedHours: number;
    hourlyPrice: number
}

const fixedPrice = ({ email, userAs, feeAmount, feeType, price, priceAfterFees, contractId }: CompletedJobContractEmailFixedPrice) => {
    const freelancerContent = `
        <p>You will recieve your payment within 10 days</p>
        <p>Amount: <strong>$${price}</strong></p>
        <p>Fees: <strong>${feeType === "percent" ? `${feeAmount}%` : `$${feeAmount}`}</strong></p>
        <p>Receive amount: <strong>$${priceAfterFees}</strong></p>
    `;

    const employerContent = `
        <p>The freelancer is going to receive <strong>$${price}</strong> (<strong>$${priceAfterFees}</strong> after fees) for completing the job</p>
    `;

    const content = userAs === "employer" ? employerContent : freelancerContent;

    const contractCompletedContent = `
        <h1>Job Contract ID ${contractId} has been completed</h1>
        <p>Congratulations, the fixed price contract has been completed successfully</p>
        ${content}
    `

    return sendEmail({
        subject: "Job Contract Completed - Lets Freelance",
        to: email,
        html: contractCompletedContent
    });
}

const hourlyPrice = ({ contractId, email, feeAmount, feeType, price, priceAfterFees, userAs, workedHours, hourlyPrice }: CompletedJobContractEmailHourlyPrice) => {
    const freelancerContent = `
        <p>You will recieve the rest of your payment within 3 days</p>
        <p>Worked hours: <strong>$${workedHours}</strong></p>
        <p>Hourly price: <strong>$${hourlyPrice}</strong></p>
        <p>Amount: <strong>$${price}</strong></p>
        <p>Fees: <strong>${feeType === "percent" ? `${feeAmount}%` : `$${feeAmount}`}</strong></p>
        <p>Receive amount: <strong>$${priceAfterFees}</strong></p>
    `

    const employerContent = `
        <p>The freelancer is going to receive the rest of the payment for completing the job</p>
        <p>Worked hours: <strong>$${workedHours}</strong></p>
        <p>Hourly price: <strong>$${hourlyPrice}</strong></p>
        <p>Amount: <strong>$${price}</strong></p>
    `;

    const content = userAs === "employer" ? employerContent : freelancerContent;

    const contractCompletedContent = `
        <h1>Job Contract ID ${contractId} has been completed</h1>
        <p>Congratulations, the hourly price contract has been completed successfully</p>
        ${content}
    `

    return sendEmail({
        subject: "Job Contract Completed - Lets Freelance",
        to: email,
        html: contractCompletedContent
    });
}

const sendCompletedJobContractEmail = {
    fixedPrice,
    hourlyPrice
}

export default sendCompletedJobContractEmail;