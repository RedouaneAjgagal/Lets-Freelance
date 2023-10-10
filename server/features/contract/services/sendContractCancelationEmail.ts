import sendEmail from "../../../services/sendEmail";

type ContractCancelationEmail = {
    email: string;
    contractId: string;
    activityTitle: string;
    value: "canceled" | "rejected";
    isRefund?: boolean;
}

const sendContractCancelationEmail = ({ email, contractId, activityTitle, value, isRefund }: ContractCancelationEmail) => {

    const approvedCancelationContent = `
        <h1>Contract ID ${contractId} has been canceled.</h1>
        <p>Due to the ${isRefund ? "refund" : "cancelation"} request we have verified and checked the contract process and come out with a decision, this contract has been canceled. ${isRefund ? "The employer is going to be refunded" : ""}</p>
        <p>Contract title: <strong>${activityTitle}</strong></p>
    `;

    const rejectedCancelationContent = `
        <h1>Cancel contract request is rejected</h1>
        <p>Due to the cancelation request we have verified and checked the contract process and come out with a decision, Contract ID ${contractId} is still in progress and cancelation request is rejected</p>
        <p>Contract title: <strong>${activityTitle}</strong></p>
    `

    const content = value === "canceled" ? approvedCancelationContent : rejectedCancelationContent;

    return sendEmail({
        subject: "Contract Cancellation - Lets Freelance",
        to: email,
        html: content
    });
}

export default sendContractCancelationEmail;