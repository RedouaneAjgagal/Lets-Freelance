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
    hourlyPrice: number;
    totalWorkedHours: number;
    totalAmount: number
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

const hourlyPrice = ({ contractId, email, hourlyPrice, totalAmount, totalWorkedHours }: CompletedJobContractEmailHourlyPrice) => {
    const content = `
        <p>Hourly price: <strong>$${hourlyPrice}</strong></p>
        <p>Total worked hours: <strong>${totalWorkedHours} hours</strong></p>
        <p>Total amount: <strong>$${totalAmount}</strong></p>
    `

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