import sendEmail from "../../../services/sendEmail"

type ContractCompletedEmail = {
    email: string;
    contractId: string;
    userAs: "freelancer" | "employer";
    paymentType: "hourly" | "fixed";
    price: number | undefined;
    priceAfterFees: number | undefined;
    activityType: "job" | "service";
}

const sendContractCompletedEmail = ({ email, contractId, userAs, paymentType, price, activityType }: ContractCompletedEmail) => {

    const freelancerContent = `<p>${paymentType === "fixed" ? `You will recieve your payment next week. amount: <strong>$${price}</strong></p>` : ""}`;

    const employerContent = `<p>${paymentType === "fixed" ? `The freelancer going to recieve <strong>$${price}</strong> for completing the ${activityType}</p>` : ""}`;

    const content = userAs === "freelancer" ? freelancerContent : employerContent;

    // <p>Order amount: <strong>$${servicePrice}</strong></p>
    //     <p>Service fee: <strong>${serviceFees.type === "percent" ? `${serviceFees.amount}%` : `$${serviceFees.amount}`}</strong></p>
    //     <p>Receive amount: <strong>$${freelancerReceiveAmount}</strong></p>

    const contractCompletedContent = `
        <h1>Contract ID ${contractId} has been completed</h1>
        <p>Congratulations, the contract has been completed successfully</p>
        ${content}
    `

    return sendEmail({
        subject: "Contract Completed - letsfreelance.io",
        to: email,
        html: contractCompletedContent
    });
}

export default sendContractCompletedEmail;