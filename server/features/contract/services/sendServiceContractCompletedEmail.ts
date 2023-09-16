import sendEmail from "../../../services/sendEmail";

type ServiceContractCompletedEmail = {
    email: string;
    contractId: string;
    userAs: "freelancer" | "employer";
    price: number;
    priceAfterFees: number;
    feeAmount: number;
    feeType: "fixed" | "percent";
}

const sendServiceContractCompletedEmail = ({ email, contractId, userAs, price, priceAfterFees, feeAmount, feeType }: ServiceContractCompletedEmail) => {

    const freelancerContent = `
        <p>You will recieve your payment within 10 days</p>
        <p>Amount: <strong>$${price}</strong></p>
        <p>Fees: <strong>${feeType === "percent" ? `${feeAmount}%` : `$${feeAmount}`}</strong></p>
        <p>Receive amount: <strong>$${priceAfterFees}</strong></p>
    `;

    const employerContent = `
        The freelancer is going to receive <strong>$${price}</strong> (<strong>$${priceAfterFees}</strong> after fees) for completing the service</p>
    `;

    const content = userAs === "freelancer" ? freelancerContent : employerContent;

    const contractCompletedContent = `
        <h1>Service Contract ID ${contractId} has been completed</h1>
        <p>Congratulations, the contract has been completed successfully</p>
        ${content}
    `;

    return sendEmail({
        subject: "Service Contract Completed - Lets Freelance",
        to: email,
        html: contractCompletedContent
    });

}

export default sendServiceContractCompletedEmail;