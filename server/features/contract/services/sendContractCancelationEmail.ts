import sendEmail from "../../../services/sendEmail";

type ContractCancelationEmail = {
    email: string;
    contractId: string;
    activityTitle: string;
    value: "canceled" | "rejected";
}

const sendContractCancelationEmail = ({ email, contractId, activityTitle, value }: ContractCancelationEmail) => {

    const approvedCancelationContent = `
        <h1>Contract ID ${contractId} has been canceled.</h1>
        <p>Due to the cancelation request we have verified and checked the contract process and come out with a decision, this contract has been canceled.</p>
        <p>Contract title: <strong>${activityTitle}</strong></p>
    `;

    const rejectedCancelationContent = `
        <h1>Cancel contract request is rejected</h1>
        <p>Due to the cancelation request we have verified and checked the contract process and come out with a decision, Contract ID ${contractId} is still in progress and cancelation request is rejected</p>
        <p>Contract title: <strong>${activityTitle}</strong></p>
    `

    const content = value === "canceled" ? approvedCancelationContent : rejectedCancelationContent;

    return sendEmail({
        subject: "Contract Cancellation Request - letsfreelance.io",
        to: email,
        html: content
    });
}

export default sendContractCancelationEmail;